from config.db import db, app, ma
from sqlalchemy import Numeric, event
from datetime import datetime, timedelta

class Recompensas(db.Model):
    __tablename__ = "tblrecompensas"

    recompensa_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recompensa_name = db.Column(db.String(30), default=None, nullable=False)
    enlace_imagen = db.Column(db.String(255), default=None, nullable=True)
    recompensa = db.Column(db.String(24), default=None, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    fecha_expira = db.Column(db.DateTime, default=None, nullable=True)
    estado_activo = db.Column(db.Boolean, default=True, nullable=True)

    def __init__(self, recompensa_name, recompensa, fecha_creacion, estado_activo, fecha_expira=None, enlace_imagen=None):
        self.recompensa_name = recompensa_name
        self.recompensa = recompensa
        self.enlace_imagen = enlace_imagen
        self.fecha_creacion = fecha_creacion
        self.fecha_expira = fecha_expira
        self.estado_activo = estado_activo

        if fecha_expira is None:
            # Si la fecha de expiración no se proporciona, se calculará después de agregar el objeto a la base de datos
            event.listen(self.__class__, 'after_insert', self.calcular_fecha_expira)

    def calcular_fecha_expira(self, mapper, connection, target):
        # Calcular la fecha de expiración basada en el recompensa_id después de agregar el objeto a la base de datos
        horas_adicionales = (target.recompensa_id - 1) * 24
        target.fecha_expira = target.fecha_creacion + timedelta(hours=horas_adicionales)

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla  
    if Recompensas.query.count() == 0:            
        # Crear registros de cuentas              
        Recompensa1 = Recompensas(recompensa_name='Saldo', recompensa='1.0', fecha_creacion=datetime.utcnow(), estado_activo=True)                                           
        Recompensa2 = Recompensas(recompensa_name='Cupon', recompensa='1.0', fecha_creacion=datetime.utcnow(), estado_activo=False)                                           
        Recompensa3 = Recompensas(recompensa_name='Saldo', recompensa='1.0', fecha_creacion=datetime.utcnow(), estado_activo=False)                                           
        Recompensa4 = Recompensas(recompensa_name='Saldo', recompensa='1.0', fecha_creacion=datetime.utcnow(), estado_activo=False)                                           
        Recompensa5 = Recompensas(recompensa_name='Saldo', recompensa='1.0', fecha_creacion=datetime.utcnow(), estado_activo=True)                                           
        # Aquí puedes agregar más recompensas tipo daily rewards por 30 días para que el usuario se pueda motivar, no continuo mas porque temás de mas testing y floje...
        db.session.add_all([Recompensa1, Recompensa2, Recompensa3, Recompensa4, Recompensa5])               
        db.session.commit()

        # Establecer la fecha de expiración para los registros existentes
        for recompensa in Recompensas.query.all():
            horas_adicionales = (recompensa.recompensa_id - 1) * 24
            recompensa.fecha_expira = recompensa.fecha_creacion + timedelta(hours=horas_adicionales)

        db.session.commit()

class RecompensasSchema(ma.Schema):
    class Meta:
        fields = ('recompensa_name', 'enlace_imagen', 'recompensa', 'fecha_creacion', 'fecha_expira', 'estado_activo')
