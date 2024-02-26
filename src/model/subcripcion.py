from config.db import db, app, ma

class Subcripcion(db.Model):
    __tablename__ = "tblsubcripciones"

    id = db.Column(db.Integer, primary_key=True)
    subcripcion_id = db.Column(db.Integer)
    subcripcion_name = db.Column(db.String(200))
    cant_pantallas = db.Column(db.Integer)
    date_start = db.Column(db.DateTime, default=None)
    

    def __init__(self, subcripcion_id, subcripcion_name, cant_pantallas, date_start=None):
        self.subcripcion_id = subcripcion_id
        self.subcripcion_name = subcripcion_name
        self.cant_pantallas = cant_pantallas
        self.date_start = date_start
        

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Subcripcion.query.count() == 0:
        # Crear registros de suscripciones
        subcripcion1 = Subcripcion(1, 'basic', 1)
        subcripcion2 = Subcripcion(2, 'basic', 1)
        
        db.session.add_all([subcripcion1, subcripcion2])
        db.session.commit()

class SubcripcionSchema(ma.Schema):
    class Meta:
        fields = ('subcripcion_id', 'subcripcion_name', 'cant_pantallas', 'date_start')
