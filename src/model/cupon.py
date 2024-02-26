from config.db import db, app, ma
from sqlalchemy import Numeric
from datetime import datetime, timedelta

class Cupones(db.Model):
    __tablename__ = "tblcupones"

    cupones_id = db.Column(db.Integer, primary_key=True)
    cupon_name = db.Column(db.String(30), default=None, nullable=False)
    cupon = db.Column(db.String(24), default=None, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    fecha_expira = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    estado_activo = db.Column(db.Boolean, default=True, nullable=True)


    def __init__(self,cupon_name,cupon, fecha_creacion,fecha_expira=None, estado_activo=None):
        self.cupon_name = cupon_name
        self.cupon = cupon
        self.fecha_creacion = fecha_creacion
        self.fecha_expira = fecha_expira
        self.estado_activo = estado_activo
        
    # Calcular la fecha de expiración un mes después de la creación si no se proporciona
        if fecha_expira is None:
            self.calcular_fecha_expira()
        else:
            self.fecha_expira = fecha_expira

        self.estado_activo = estado_activo

    def calcular_fecha_expira(self):
        # Calcular la fecha de expiración un mes después de la creación
        self.fecha_expira = self.fecha_creacion + timedelta(days=30)

with app.app_context():
    db.create_all()

     # Verificar si ya hay registros en la tabla  
    if Cupones.query.count() == 0:            
         # Crear registros de cuentas              
        Cupon1 = Cupones(cupon_name='SaldodeBienvenida', cupon='K324-2Mnb-210b-2Vmq',fecha_creacion=datetime.utcnow(),estado_activo=True)                      
        Cupon2 = Cupones(cupon_name='SaldodeCurioso', cupon='ag24-AJBN-MATz-raTa',fecha_creacion=datetime.utcnow(),estado_activo=True)                      
        Cupon3 = Cupones(cupon_name='SaldodeTwitter', cupon='Tg64-15nb-2hja-tuik',fecha_creacion=datetime.utcnow(),estado_activo=True)                      
        Cupon4 = Cupones(cupon_name='SaldodeInstagram', cupon='Itaj-mlaz-vbvc-zxvn',fecha_creacion=datetime.utcnow(),estado_activo=True)                      
        Cupon5 = Cupones(cupon_name='SaldodeFacebook', cupon='Fsjx-qgxz-zcbm-tyuia',fecha_creacion=datetime.utcnow(),estado_activo=True)                      
                                           
        
                                                    
        db.session.add_all([Cupon1,Cupon2,Cupon3,Cupon4,Cupon5])               
        db.session.commit()

class CuponesSchema(ma.Schema):
    class Meta:
        fields = ('cupon_name','cupon','fecha_creacion','fecha_expira','estado_activo')