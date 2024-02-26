from config.db import db, app, ma
from datetime import datetime, timedelta

class User(db.Model):
    __tablename__ = "tblusers"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_subcripcion = db.Column(db.Integer, db.ForeignKey('tblsubcripciones.id'))
    id_cuenta = db.Column(db.Integer, db.ForeignKey('tblcuentas.cuenta_id'))
    id_estado = db.Column(db.Integer, db.ForeignKey('tblestados.estado_id'))
    id_experiencia = db.Column(db.Integer, db.ForeignKey('tblexperiencias.experiencia_id'))
    id_usersroles = db.Column(db.Integer, db.ForeignKey('tblusersroles.rol_id'))
    id_notificacion = db.Column(db.Integer, db.ForeignKey('tblnotificaciones.notificacion_id'))
    id_perfil = db.Column(db.Integer, db.ForeignKey('tblperfiles.perfil_id'))
    id_encuesta = db.Column(db.Integer, db.ForeignKey('tblencuesta.encuesta_id'))
    id_ticket = db.Column(db.Integer, db.ForeignKey('tbltickets.ticket_id'))
    id_inventario = db.Column(db.Integer, db.ForeignKey('tblinventario.inventario_id'))
    id_token = db.Column(db.Integer, db.ForeignKey('tbltokens.token_id')) 
    username = db.Column(db.String(200))
    email = db.Column(db.String(200))
    password = db.Column(db.String(200))
    fullname = db.Column(db.String(200))
    celular = db.Column(db.Integer,nullable=True, default=None)
    correo_recuperacion = db.Column(db.String(200),nullable=True, default=None)
    pregunta_recuperacion = db.Column(db.String(200),nullable=True, default=None)

    def __init__(self, id_subcripcion, id_cuenta, id_estado, id_experiencia, id_usersroles,id_notificacion,id_perfil,id_encuesta,id_ticket,id_inventario,id_token, username, email, password, fullname):
        self.id_subcripcion = id_subcripcion
        self.id_cuenta = id_cuenta
        self.id_estado = id_estado
        self.id_experiencia = id_experiencia
        self.id_usersroles = id_usersroles
        self.id_notificacion = id_notificacion
        self.id_perfil = id_perfil
        self.id_encuesta = id_encuesta
        self.id_ticket = id_ticket
        self.id_inventario = id_inventario
        self.id_token = id_token
        self.username = username
        self.email = email
        self.password = password
        self.fullname = fullname
        
with app.app_context():
    db.create_all()

# Verificar si ya hay registros en la tabla
    if User.query.count() == 0:
        # Crear registros de usuarios
        user1 = User(
            id_subcripcion=1,
            id_cuenta=1,
            id_estado=1,
            id_experiencia=1,
            id_usersroles=1,
            id_notificacion=1,
            id_perfil=1,
            id_encuesta=1,
            id_ticket=1,
            id_inventario=1,
            id_token = 1,
            username='SALM',
            email='null',
            password='SALMñ',
            fullname='SALM',
        )
        user2 = User(
            id_subcripcion=2,
            id_cuenta=2,
            id_estado=2,
            id_experiencia=2,
            id_usersroles=2,
            id_notificacion=2,
            id_perfil=2,
            id_encuesta=2,
            id_ticket=2,
            id_inventario=2,
            id_token = 2,
            username='operador_salm',
            email='stremovify@gmail.com',
            password='Operadorñ',
            fullname='Operador',
        )
        
        db.session.add_all([user1, user2])
        db.session.commit()
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id_subcripcion', 'id_cuenta', 'id_estado', 'id_experiencia', 'id_perfilescreados','id_usersroles','id_notificacion','id_perfil','id_encuesta','id_ticket','id_inventario','id_token','username','email','password','fullname')