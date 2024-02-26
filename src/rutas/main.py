from config.db import db , ma , app
from flask import Blueprint , render_template,request,jsonify,session,url_for,redirect
from model.user import User, UserSchema
from model.token import Token, TokensSchema
from datetime import datetime, timedelta

routes_main = Blueprint("routes_main",__name__)

#creamos la ruta del home
@routes_main.route("/indexmain", methods=["GET"])
def indexmain():
    # Verificar si el usuario está autenticado
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        if user:
            username = user.username
        else:
            username = "Acceder"
    else:
        username = "Acceder"

    titulo = "Pagina Principal"
    return render_template('main/index.html', titles=titulo, username=username)



@routes_main.route("/logout", methods=["POST"])
def logout():
    if 'token' in session:
        del session['token']
        
    # Eliminar el token de la base de datos
    token = request.headers.get('Authorization')  # O dondequiera que almacenes el token en la solicitud
    if token:
        token_entry = Token.query.filter_by(token=token).first()
        if token_entry:
            db.session.delete(token_entry)
            db.session.commit()
            return jsonify({'message': 'Sesión cerrada exitosamente'}), 200

    return jsonify({'message': 'Error al cerrar sesión'}), 500

# @routes_main.route('/check_token', methods=['POST'])
# def check_token():
#     user_id = session.get('user_id')
#     if user_id:
#         user = User.query.get(user_id)

#         if user:
#             print('Token Expiration:', user.expiration)
#             now = datetime.now()
#             print('Current Datetime:', now)

#             # Asegúrate de ajustar los nombres de las columnas según tu modelo
#             if user.token == request.headers.get('Authorization')[7:]:
#                 if user.is_token_valid():
#                     print('Is Token Valid: True')
#                     return jsonify({'token_expired': False}), 200

#                 # Token expired or does not exist, remove it from the user object
#                 user.token = None
#                 user.expiration = None
#                 db.session.commit()  # Confirmar los cambios en la base de datos
#                 print('Token deleted from user object')

#     print('Is Token Valid: False')
#     return jsonify({'token_expired': True}), 401