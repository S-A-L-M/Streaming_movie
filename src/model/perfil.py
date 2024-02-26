from config.db import db, app, ma
from datetime import datetime, timedelta, timezone

class Perfiles(db.Model):
    __tablename__ = "tblperfiles"

    perfil_id = db.Column(db.Integer, primary_key=True)
    id_token = db.Column(db.Integer, db.ForeignKey('tbltokens.token_id'))
    nombrecompleto = db.Column(db.String(50), nullable=True, default=None)
    username = db.Column(db.String(20), nullable=True)
    pin = db.Column(db.String(4), nullable=True)
    fecha_nacimiento = db.Column(db.DateTime, default=None, nullable=True)
    nombrecompleto2 = db.Column(db.String(50), nullable=True, default=None)
    username2 = db.Column(db.String(20), nullable=True)
    pin2 = db.Column(db.String(4), nullable=True)
    fecha_nacimiento2 = db.Column(db.DateTime, default=None, nullable=True)
    

    def __init__(self,id_token, username=None,pin=None, nombrecompleto=None, fecha_nacimiento=None,username2=None, nombrecompleto2=None, pin2=None, fecha_nacimiento2=None):
        self.id_token = id_token
        self.username = username
        self.pin = pin
        self.nombrecompleto = nombrecompleto
        self.fecha_nacimiento = fecha_nacimiento
        self.username2 = username2
        self.nombrecompleto2 = nombrecompleto2
        self.pin2 = pin2
        self.fecha_nacimiento2 = fecha_nacimiento2
        

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Perfiles.query.count() == 0:
        # Crear registros de experiencias
        perfil1 = Perfiles(id_token=1,nombrecompleto='User', username='username', pin='1234')
        perfil2 = Perfiles(id_token=2,nombrecompleto='User2',username='username2', pin='2345')

        db.session.add_all([perfil1, perfil2])
        db.session.commit()

class PerfilesSchema(ma.Schema):
    class Meta:
        fields = ('id_token','nombrecompleto', 'username', 'pin','fecha_nacimiento','fecha_nacimiento','nombrecompleto2', 'username2', 'pin2','fecha_nacimiento2','fecha_nacimiento2')