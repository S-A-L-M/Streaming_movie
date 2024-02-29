from config.db import db , ma , app
from flask import Blueprint , render_template,request,jsonify,session
from model.user import User, UserSchema  
from model.token import Token, TokensSchema  
import secrets
from datetime import datetime, timedelta    

routes_login = Blueprint("routes_login",__name__)

#creamos del registro
@routes_login.route("/indexlogin" , methods=["GET"])
def indexlogin():
    

    return render_template('/main/login.html')

@routes_login.route('/login', methods=['POST'])
def login():
    fullemail = request.json.get('fullemail')
    fullpassword = request.json.get('fullpassword')

    # Verificar si el usuario y la contraseña son válidos en la base de datos
    user = User.query.filter_by(email=fullemail, password=fullpassword).first()

    if user:
        # Verificar si el usuario ya tiene un token asignado
        if user.id_token:
            idUser = user.id
            # Si ya tiene un token, sobrescribirlo
            existing_token = Token.query.get(user.id_token)
            existing_token.token = secrets.token_urlsafe(32)
            existing_token.ip = request.remote_addr
            existing_token.dispositivo = request.user_agent.string
        else:
            # Si no tiene un token, generar uno nuevo
            new_token = secrets.token_urlsafe(32)

            # Crear una nueva instancia de Token
            token_entry = Token(token=new_token, ip=request.remote_addr, dispositivo=request.user_agent.string)

            # Agregar la nueva instancia de Token a la sesión de la base de datos
            db.session.add(token_entry)
            db.session.commit()  # Guardar el token en la base de datos para obtener su ID

            # Asignar el ID del token al campo id_token del usuario
            user.id_token = token_entry.token_id

        # Commit de la sesión
        db.session.commit()

        # Iniciar sesión al usuario
        session['user_id'] = user.id

        # Crear la respuesta JSON con el token
        response_body = {'message': 'Inicio de sesión exitoso', 'user_id':user.id, 'token': existing_token.token if existing_token else new_token}
        status = 200
    else:
        # Si las credenciales no son válidas, envíe un mensaje de error
        response_body = {'message': 'Credenciales inválidas'}
        status = 401
    
    headers = {'Content-Type': 'application/json'}
    return jsonify(response_body), status, headers





