from config.db import db, app, ma
from sqlalchemy import Numeric
from datetime import datetime, timedelta

class Cuentas(db.Model):
    __tablename__ = "tblcuentas"

    cuenta_id = db.Column(db.Integer, primary_key=True)
    saldo = db.Column(Numeric(precision=18, scale=2), default=0.0)
    num_cuenta = db.Column(db.Integer, unique=True, nullable=False)
    registration = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    

    def __init__(self, num_cuenta, registration, saldo=0.0):
        self.saldo = saldo
        self.num_cuenta = num_cuenta
        self.registration = registration

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Cuentas.query.count() == 0:
        # Crear registros de cuentas
        cuenta1 = Cuentas(saldo=0.0, num_cuenta=1000, registration=datetime.utcnow())
        cuenta2 = Cuentas(saldo=0.0, num_cuenta=1001, registration=datetime.utcnow())
        
        
        db.session.add_all([cuenta1, cuenta2])
        db.session.commit()

class CuentasSchema(ma.Schema):
    class Meta:
        fields = ('saldo','num_cuenta','registration')
