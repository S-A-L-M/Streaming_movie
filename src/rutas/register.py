from config.db import db , ma , app
from datetime import datetime, timezone, timedelta
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import os
import ssl
from email.message import EmailMessage
from flask import Blueprint , render_template,request,jsonify,session
from jinja2 import Template
from sqlalchemy.exc import IntegrityError
from model.user import User, UserSchema
from model.userroles import UserRoles, UserRolesSchema
from model.subcripcion import Subcripcion, SubcripcionSchema
from model.estado import Estados, EstadosSchema
from model.experiencia import Experiencia, ExperienciasSchema
from model.cuenta import Cuentas, CuentasSchema
from model.notificacion import Notificacion, NotificacionSchema
from model.perfil import Perfiles, PerfilesSchema
from model.token import Token, TokensSchema
from model.encuesta import Encuesta, EncuestaSchema
from model.ticket import Ticket,TicketSchema
from model.botcorreo import BotCorreos, BotCorreosSchema
from model.inventario import Inventario, InventarioSchema


routes_register = Blueprint("routes_register",__name__)

#creamos la ruta del home
@routes_register.route("/indexregister" , methods=["GET"])
def indexregister():
    return render_template('/main/register.html')


@routes_register.route('/forgotpassword', methods=['POST'])
def forgotpassword():
    fullcorreo = request.json['fullcorreo']

    # Check if the user has exceeded the request limit
    now = datetime.now(timezone.utc)
    elapsed_time = timedelta(minutes=5)
    request_count = 0

    if 'last_request_time' in session and 'request_count' in session:
        last_request_time = session['last_request_time']
        request_count = session['request_count']
        elapsed_time = now - last_request_time

        # Calculate the time remaining until the limit resets
        time_to_wait = timedelta(minutes=5 + (request_count - 1)) - elapsed_time
        hours = time_to_wait.seconds // 3600
        minutes = (time_to_wait.seconds % 3600) // 60
        seconds = time_to_wait.seconds % 60

        if elapsed_time < timedelta(minutes=5 + (request_count - 1)) and request_count >= 5:
            return jsonify({'message': f'Too many requests. Please try again in {hours} hour(s), {minutes} minute(s), and {seconds} second(s).', 'time_to_wait': time_to_wait.total_seconds()}), 429

    # No necesitas consultar la base de datos para verificar la existencia del correo electrónico

    # Genera un código de verificación basado en el hash del correo electrónico
    code_list = random.sample(range(10), 4)
    code = ''.join(str(digit) for digit in code_list)

    # Guarda el código en la sesión
    session['verification_code'] = code

     # Obtén la información de la tabla tblbotcorreos
    bot_correos_info = BotCorreos.query.first()

    # Renderiza el contenido HTML directamente desde el campo 'body' del modelo
    body_template = Template(bot_correos_info.body)
    
    # Renderiza las variables de la plantilla
    body = body_template.render(subject=bot_correos_info.subject, code=code)

    # Envía el correo electrónico al usuario con el código
    sender_email = bot_correos_info.sender_email
    sender_password = bot_correos_info.sender_password
    receiver_email = fullcorreo

    msg = MIMEMultipart()
    msg.attach(MIMEText(body, 'html'))
    msg['Subject'] = bot_correos_info.subject
    msg['From'] = sender_email
    msg['To'] = receiver_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())

    # Reinicia el contador de solicitudes si ha pasado el tiempo
    if elapsed_time >= timedelta(minutes=5 + (request_count - 1)):
        session['request_count'] = 1
    else:
        # Actualiza la sesión con el contador de solicitudes y la última hora de solicitud
        session['request_count'] = session.get('request_count', 0) + 1
    session['last_request_time'] = now

    return jsonify({'message': 'Verification code sent.'})

@routes_register.route('/verificarcode', methods=['POST'])
def verificarcode():
    
    verification_code = request.json['verification_code']
    stored_code = session.get('verification_code')
    
    if verification_code == stored_code:
        # Si el código es correcto, redireccionar al usuario a la página de cambio de contraseña
        response_body = {'message': 'Código verificado correctamente'}
        status = 200
        session.pop('verification_code', None)
        return jsonify(response_body), status
    else:
        # Si el código no es correcto, devolver un error
        response_body = {'message': 'El código ingresado es incorrecto. Inténtalo de nuevo.'}
        status = 401
        return jsonify(response_body), status



@routes_register.route('/saveUsuarios', methods=['POST'])
def saveUsuarios():
    try:
        # Obtener datos del cuerpo de la solicitud JSON
        username = request.json['username']
        fullname = request.json['fullname']
        correo = request.json['correo']
        contrasena = request.json['contrasena']
        format = request.json['format']

        # Mapeo de opciones seleccionadas a valores específicos
        subcripcion_mapping = {
            'basic': {'subcripcion_id': 1, 'subcripcion_name': 'basic', 'cant_pantallas': 1},
            'trial': {'subcripcion_id': 2, 'subcripcion_name': 'trial', 'cant_pantallas': 1},
            'personal': {'subcripcion_id': 3, 'subcripcion_name': 'personal', 'cant_pantallas': 1},
            'duo': {'subcripcion_id': 4, 'subcripcion_name': 'duo', 'cant_pantallas': 2},
        }

        # Obtener datos de subscripción según la opción seleccionada
        selected_subscription = subcripcion_mapping.get(format)

        if not selected_subscription:
            return jsonify({"error": "Formato de subscripción no válido"}), 400

        # Crear una nueva subscripción
        nueva_subcripcion = Subcripcion(
            subcripcion_id=selected_subscription['subcripcion_id'],
            subcripcion_name=selected_subscription['subcripcion_name'],
            cant_pantallas=selected_subscription['cant_pantallas'],
            date_start=datetime.utcnow()
        )
        print(f"Formato seleccionado: {format}")
        print(f"Selected subscription: {selected_subscription}")

        # Agregar la subscripción a la sesión y realizar la transacción
        db.session.add(nueva_subcripcion)
        db.session.commit()
        
        # Obtener el ID de la subscripción recién creada
        id_subcripcion = nueva_subcripcion.id

        # Crear una nueva cuenta con saldo por defecto de 0.0, número de cuenta único y fecha de registro
        nueva_cuenta = Cuentas(saldo=0.0, num_cuenta=obtener_proximo_numero_de_cuenta(), registration=datetime.utcnow())

        # Agregar la cuenta a la sesión y realizar la transacción
        db.session.add(nueva_cuenta)
        db.session.commit()

        # Obtener el ID de la cuenta recién creada
        id_cuenta = nueva_cuenta.cuenta_id
        
        # Crear una nueva instancia de Experiencia con el nivel y experiencia predeterminados
        nueva_experiencia = Experiencia(nivel=1, experiencia=0)

        # Agregar la experiencia a la sesión y realizar la transacción
        db.session.add(nueva_experiencia)
        db.session.commit()

        # Obtener el ID de la experiencia recién creada
        id_experiencia = nueva_experiencia.experiencia_id


        # Crear una nueva instancia de Notificacion predeterminados
        nueva_notificacion = Notificacion(titulo='Enhorabuena', descripcion='Tu cuenta ha sido creada Satisfactoriamente')
        
        db.session.add(nueva_notificacion)
        db.session.commit()
        
        # Obtener el ID de la notificacion recién creada
        id_notificacion = nueva_notificacion.notificacion_id
        
        # Crear una nueva instancia de inventario predeterminados
        nuevo_inventario = Inventario(id_tipo_samfiwin=None,id_item_samfiwin=None,id_item_cupon=None,id_item_recompensa=None,conseguido_perfil_by=None, fecha_conseguido=None,reclamado=None,fecha_reclamado=None,expirado=None,fecha_expirado=None,fecha_caduce=None)

        db.session.add(nuevo_inventario)
        db.session.commit()

        # Obtener el ID de la ticket recién creadaaaaaaaaa
        id_inventario = nuevo_inventario.inventario_id
        
        # Crear una nueva instancia de Encuesta predeterminados
        nueva_encuesta = Encuesta(stars=None, role=None, recomendation=None, improve=None, suggest=None)

        db.session.add(nueva_encuesta)
        db.session.commit()

        # Obtener el ID de la encuesta recién creada
        id_encuesta = nueva_encuesta.encuesta_id

        # Crear una nueva instancia de ticket predeterminados
        nuevo_ticket = Ticket(tipo_ayuda=None, asunto=None, descripcion=None, imagen=None)

        db.session.add(nuevo_ticket)
        db.session.commit()

        # Obtener el ID de la ticket recién creada
        id_ticket = nuevo_ticket.ticket_id

        # Crear una nueva instancia de Notificacion predeterminados
        nuevo_estado = Estados(is_active= True, is_suspended_account=False, is_delete_account=False, last_active=datetime.utcnow())

        db.session.add(nuevo_estado)
        db.session.commit()
        
        # Obtener el ID dEL ESTADO recién creadO
        id_estado = nuevo_estado.estado_id
        
        # Crear una nueva instancia de Token con valores nulos
        nuevo_token = Token(token=None, ip=None, dispositivo=None)

        # Agregar el token a la sesión y realizar la transacción
        db.session.add(nuevo_token)
        db.session.commit()

        # Obtener el ID del token recién creado
        id_token = nuevo_token.token_id

        # Crear una nueva instancia de Perfiles con los datos proporcionados
        nuevo_perfil = Perfiles(id_token=id_token, username=username, nombrecompleto=fullname, fecha_nacimiento=None)

        # Asociar el id_token al Perfiles
        nuevo_perfil.id_token = id_token

        # Agregar el perfil a la sesión y realizar la transacción
        db.session.add(nuevo_perfil)
        db.session.commit()

        # Obtener el ID del perfil recién creado
        id_perfil = nuevo_perfil.perfil_id

        # Obtener los IDs de las llaves foráneas
        id_usersroles = UserRoles.query.filter_by(rol_name='Cliente').first().rol_id

        # Crear una nueva instancia de User con el ID de la cuenta
        new_user = User(
        id_subcripcion=id_subcripcion,
        id_estado=id_estado,
        id_notificacion=id_notificacion,
        id_experiencia=id_experiencia,
        id_usersroles=id_usersroles,
        id_perfil=id_perfil,
        id_cuenta=id_cuenta,
        id_encuesta=id_encuesta,
        id_ticket=id_ticket,
        id_inventario=id_inventario,
        id_token=id_token,
        username=username,
        email=correo,
        password=contrasena,
        fullname=fullname,
        )

        # Agregar la instancia a la sesión y realizar la transacción
        db.session.add(new_user)
        db.session.commit()

        # Si las credenciales son válidas, inicie sesión al usuario
        return {
            "status": 200,
            "message": "Inicio de sesión exitoso",
            "nombre_usuario": username
        }

    except IntegrityError as e:
        print(f"Error de integridad de la llave foránea: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Error de integridad de la llave foránea"}), 400


def obtener_proximo_numero_de_cuenta():
    # Obtener el número de cuenta máximo actual
    max_numero_cuenta = db.session.query(db.func.max(Cuentas.num_cuenta)).scalar()

    # Si hay registros, incrementar el número de cuenta, de lo contrario, comenzar en 1
    if max_numero_cuenta is not None:
        return max_numero_cuenta + 1
    else:
        # Obtén el último registro para asegurarte de que no haya entradas duplicadas
        ultimo_registro = Cuentas.query.order_by(Cuentas.cuenta_id.desc()).first()

        if ultimo_registro is not None:
            return ultimo_registro.num_cuenta + 1
        else:
            return 1000

@routes_register.route('/checkemail', methods=['POST'])
def check_email():
    fullemail = request.json['fullemail']

    # Verificar si el correo ya existe en la base de datos
    user = User.query.filter_by(email=fullemail).first()

    if user:
        session['user_id'] = user.id
        response_body = {'message': 'El correo electrónico ya está registrado.', 'email_exists': True}
        print('EXISTE')
        # status = 400  # Código de estado para el correo existente TESTING
    else:
        response_body = {'message': 'El correo electrónico no está registrado.', 'email_exists': False}
        print('NO EXISTE')
        # status = 200  # Código de estado para el correo no existente

    headers = {'Content-Type': 'application/json'}
    return jsonify(response_body), headers


@routes_register.route('/checkusername', methods=['POST'])
def check_username():
    fullusername = request.json['fullusername']

    # Verificar si el correo ya existe en la base de datos
    user = User.query.filter_by(username=fullusername).first()

    if user:
        session['user_id'] = user.id
        response_body = {'message': 'El username ya está usado.', 'username_exists': True}
        print('EXISTE')
        # status = 400  # Código de estado para el correo existente TESTING
    else:
        response_body = {'message': 'El username no está en usado.', 'username_exists': False}
        print('NO EXISTE')
        # status = 200  # Código de estado para el correo no existente

    headers = {'Content-Type': 'application/json'}
    return jsonify(response_body), headers

