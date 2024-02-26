from config.db import db, app, ma
from sqlalchemy import Numeric
from datetime import datetime, timedelta

class Inventario(db.Model):
    __tablename__ = "tblinventario"

    inventario_id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    id_tipo_samfiwin = db.Column(db.Integer, db.ForeignKey('tbltiposamfiwin.tiposamfiwin_id'))
    id_item_samfiwin = db.Column(db.Integer, db.ForeignKey('tblsamfiwin.samfiwin_id'), nullable=True, default=None)
    id_item_cupon = db.Column(db.Integer, db.ForeignKey('tblcupones.cupones_id'), nullable=True, default=None)
    id_item_recompensa = db.Column(db.Integer, db.ForeignKey('tblrecompensas.recompensa_id'), nullable=True, default=None)
    conseguido_perfil_by = db.Column(db.String(40), default=None, nullable=True)
    fecha_conseguido = db.Column(db.Integer, nullable=True,default=None)
    reclamado = db.Column(db.Boolean, nullable=True,default=None)
    fecha_reclamado = db.Column(db.DateTime, nullable=True,default=None)
    expirado = db.Column(db.Boolean,nullable=True,default=None)
    fecha_expirado = db.Column(db.DateTime,nullable=True,default=None)
    fecha_caduce = db.Column(db.DateTime,nullable=True,default=None)


    def __init__(self,conseguido_perfil_by,id_tipo_samfiwin=None,id_item_samfiwin=None,id_item_cupon=None,id_item_recompensa=None,fecha_conseguido=None,reclamado=None, fecha_reclamado=None,expirado=None,fecha_expirado=None,fecha_caduce=None):
        self.id_tipo_samfiwin = id_tipo_samfiwin
        self.id_item_cupon = id_item_cupon
        self.id_item_recompensa = id_item_recompensa
        self.conseguido_perfil_by = conseguido_perfil_by
        self.id_item_samfiwin = id_item_samfiwin
        self.fecha_conseguido = fecha_conseguido
        self.reclamado = reclamado
        self.fecha_reclamado = fecha_reclamado
        self.expirado = expirado
        self.fecha_expirado = fecha_expirado
        self.fecha_caduce = fecha_caduce

with app.app_context():
    db.create_all()

     # Verificar si ya hay registros en la tabla  
    if Inventario.query.count() == 0:            
         # Crear registros de cuentas              
        inv1 = Inventario(conseguido_perfil_by='username')                                                                                 
        inv2 = Inventario(conseguido_perfil_by='username2')                                                                                 
                                                    
        db.session.add_all([inv1,inv2])               
        db.session.commit()

class InventarioSchema(ma.Schema):
    class Meta:
        fields = ('id_tipo_samfiwin','id_item_cupon','id_item_recompensa','conseguido_perfil_by','id_item_samfiwin','fecha_conseguido','reclamado','fecha_reclamado','expirado','fecha_expirado','fecha_caduce')