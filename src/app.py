#favor mantener todo organizado
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from config.db import db, app, ma
from model.user import User, UserSchema  


#Importar los model (Tabla de la base de datos)
#Tener en cuenta el orden de las tabla para las relaciones
from api.botcorreos import routes_botcorreos
from api.experiencia import routes_experiencia
from api.cuenta import routes_cuenta
from api.encuesta import routes_encuesta
from api.ticket import routes_ticket
from api.estado import routes_estados
from api.token import routes_token
from api.tipo_samfiwin import routes_tiposamfiwin
from api.recompensa import routes_recompensa
from api.cupon import routes_cupon
from api.samfiwin import routes_samfiwin
from api.notificacion import routes_notificacion
from api.subcripcion import routes_subcripcion
from api.inventario import routes_inventario
from api.perfil import routes_perfiles
from api.userroles import routes_userroles
from api.user import routes_user
from api.peliculas import routes_peliculas







#importar rutas
from rutas.main import routes_main
from rutas.details import routes_details
from rutas.movielist import routes_movielist
from rutas.registromain import routes_RegistroMain
from rutas.login import routes_login
from rutas.register import routes_register
from rutas.profile import routes_profile
from rutas.presentation import routes_presentation
from rutas.cancelledpayment import routes_cancelledpayment
from rutas.sucesspayment import routes_sucesspayment





#ubicacion del api 
app.register_blueprint(routes_experiencia, url_prefix="/api")
app.register_blueprint(routes_subcripcion, url_prefix="/api")
app.register_blueprint(routes_userroles, url_prefix="/api")
app.register_blueprint(routes_estados, url_prefix="/api")
app.register_blueprint(routes_user, url_prefix="/api")
app.register_blueprint(routes_cuenta, url_prefix="/api")
app.register_blueprint(routes_peliculas, url_prefix="/api")
app.register_blueprint(routes_notificacion, url_prefix="/api")
app.register_blueprint(routes_perfiles, url_prefix="/api")
app.register_blueprint(routes_token, url_prefix="/api")
app.register_blueprint(routes_encuesta, url_prefix="/api")
app.register_blueprint(routes_ticket, url_prefix="/api")
app.register_blueprint(routes_botcorreos, url_prefix="/api")
app.register_blueprint(routes_samfiwin, url_prefix="/api")
app.register_blueprint(routes_inventario, url_prefix="/api")
app.register_blueprint(routes_tiposamfiwin, url_prefix="/api")
app.register_blueprint(routes_cupon, url_prefix="/api")
app.register_blueprint(routes_recompensa, url_prefix="/api")










#ubicacion rutas
app.register_blueprint(routes_main, url_prefix="/fronted")
app.register_blueprint(routes_details, url_prefix="/fronted")
app.register_blueprint(routes_movielist, url_prefix="/fronted")
app.register_blueprint(routes_RegistroMain, url_prefix="/fronted")
app.register_blueprint(routes_login, url_prefix="/fronted")
app.register_blueprint(routes_register, url_prefix="/fronted")
app.register_blueprint(routes_profile, url_prefix="/fronted")
app.register_blueprint(routes_presentation, url_prefix="/fronted")
app.register_blueprint(routes_cancelledpayment, url_prefix="/fronted")
app.register_blueprint(routes_sucesspayment, url_prefix="/fronted")



@app.route("/")
def index():
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

@app.route("/algo")
def otr():
    return "hola mondongo"


if __name__ == '__main__':
   # load_dotenv()
    app.run(debug=True, port=5000, host='0.0.0.0')