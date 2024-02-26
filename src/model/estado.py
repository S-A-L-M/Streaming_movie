from config.db import db, app, ma
from datetime import datetime

class Estados(db.Model):
    __tablename__ = "tblestados"

    estado_id = db.Column(db.Integer, primary_key=True)
    is_active = db.Column(db.Boolean, default=False)
    is_suspended_account = db.Column(db.Boolean, default=False)
    is_delete_account = db.Column(db.Boolean, default=False)
    last_active = db.Column(db.DateTime, nullable=False)

    def __init__(self, is_active, is_suspended_account, is_delete_account, last_active):
        self.is_active = is_active
        self.is_suspended_account = is_suspended_account
        self.is_delete_account = is_delete_account
        self.last_active = last_active

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Estados.query.count() == 0:
        # Crear registros de estados
        estado1 = Estados(
            is_active=True,
            is_suspended_account=False,
            is_delete_account=False,
            last_active=datetime.now(),
        )
        estado2 = Estados(
            is_active=True,
            is_suspended_account=False,
            is_delete_account=False,
            last_active=datetime.now(),
        )

        db.session.add_all([estado1, estado2])
        db.session.commit()

class EstadosSchema(ma.Schema):
    class Meta:
        fields = ('is_active', 'is_suspended_account', 'is_delete_account', 'last_active')
