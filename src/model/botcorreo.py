from config.db import db, app, ma
from sqlalchemy import Numeric
from datetime import datetime, timedelta

class BotCorreos(db.Model):
    __tablename__ = "tblbotcorreos"

    botcorreos_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    version = db.Column(Numeric(precision=18, scale=2), default=0.0)
    nombre = db.Column(db.String(40), default=None, nullable=True)
    sender_email = db.Column(db.String(30), default=None, nullable=True)
    sender_password = db.Column(db.String(30), default=None, nullable=True)
    subject = db.Column(db.String(40), default=None, nullable=True)
    body = db.Column(db.Text, default=None, nullable=True)


    def __init__(self,version,nombre, sender_email, sender_password, subject,body):
        self.version = version
        self.nombre = nombre
        self.sender_email = sender_email
        self.sender_password = sender_password
        self.subject = subject
        self.body = body

with app.app_context():
    db.create_all()

    # # Verificar si ya hay registros en la tabla  |
    # if BotCorreos.query.count() == 0:            |
    #     # Crear registros de cuentas             | 
    #     bot1 = BotCorreos()                      | -----> SI QUIERES LA POSIBILIDAD DE Disfrutar EL CONTENIDO COMPLETO DE CÓDIGO DEL DESIGN GMAIL, IMPORTA EN LA CARPETA 'RESOURCESSQL' AL XAMPP
        
                                                    
    #     db.session.add_all([bot1])               |
    #     db.session.commit()

class BotCorreosSchema(ma.Schema):
    class Meta:
        fields = ('version','nombre','sender_email','sender_password','subject', 'body')