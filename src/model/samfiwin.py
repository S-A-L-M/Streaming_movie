from config.db import db, app, ma
from sqlalchemy import Numeric
from datetime import datetime, timedelta

class SamfiWin(db.Model):
    __tablename__ = "tblsamfiwin"

    samfiwin_id = db.Column(db.Integer, primary_key=True)
    is_lock = db.Column(db.Boolean, default=True, nullable=True)
    nombre = db.Column(db.String(40), default=None, nullable=True)
    ewinexp_req = db.Column(db.Integer, nullable=False)
    nivel_req = db.Column(db.Integer, nullable=False)
    experiencia_req = db.Column(db.Integer,nullable=False)


    def __init__(self,is_lock,nombre, ewinexp_req,nivel_req, experiencia_req):
        self.is_lock = is_lock
        self.nombre = nombre
        self.ewinexp_req = ewinexp_req
        self.nivel_req = nivel_req
        self.experiencia_req = experiencia_req

with app.app_context():
    db.create_all()

     # Verificar si ya hay registros en la tabla  
    if SamfiWin.query.count() == 0:            
         # Crear registros de cuentas              
        SamfiWin1 = SamfiWin(is_lock=True, nombre='Aumento_Tiempo',ewinexp_req=0,nivel_req=1, experiencia_req=0)                      
        SamfiWin2 = SamfiWin(is_lock=False, nombre='Aumento_Tiempo',ewinexp_req=500,nivel_req=5, experiencia_req=0)                      
        SamfiWin3 = SamfiWin(is_lock=False, nombre='Aumento_Tiempo',ewinexp_req=1000,nivel_req=10, experiencia_req=0)                      
        SamfiWin4 = SamfiWin(is_lock=False, nombre='Aumento_Tiempo',ewinexp_req=1500,nivel_req=15, experiencia_req=0)                      
        SamfiWin5 = SamfiWin(is_lock=False, nombre='Aumento_Tiempo',ewinexp_req=2000,nivel_req=20, experiencia_req=0)                                         
        
                                                    
        db.session.add_all([SamfiWin1,SamfiWin2,SamfiWin3,SamfiWin4,SamfiWin5])               
        db.session.commit()

class SamfiWinSchema(ma.Schema):
    class Meta:
        fields = ('is_lock','nombre','ewinexp_req','nivel_req','experiencia_req')