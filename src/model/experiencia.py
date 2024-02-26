from config.db import db, app, ma

class Experiencia(db.Model):
    __tablename__ = "tblexperiencias"

    experiencia_id = db.Column(db.Integer, primary_key=True)
    nivel = db.Column(db.Integer, nullable=False)
    experiencia = db.Column(db.Integer,nullable=False)
    

    def __init__(self, nivel, experiencia):
        self.nivel = nivel
        self.experiencia = experiencia
        

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Experiencia.query.count() == 0:
        # Crear registros de experiencias
        experiencia1 = Experiencia(nivel=1000, experiencia=10000)
        experiencia2 = Experiencia(nivel=1000, experiencia=10000)

        db.session.add_all([experiencia1, experiencia2])
        db.session.commit()

class ExperienciasSchema(ma.Schema):
    class Meta:
        fields = ('nivel', 'experiencia')
