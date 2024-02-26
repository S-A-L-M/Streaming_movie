from config.db import db, app, ma

class Encuesta(db.Model):
    __tablename__ = "tblencuesta"

    encuesta_id = db.Column(db.Integer, primary_key=True)
    stars = db.Column(db.Integer, nullable=True, default=None)
    role = db.Column(db.String(20),nullable=True, default=None)
    recomendation = db.Column(db.String(20),nullable=True, default=None)
    improve = db.Column(db.String(20),nullable=True, default=None)
    suggest = db.Column(db.String(200),nullable=True, default=None)
    

    def __init__(self, stars=None, role=None, recomendation=None,improve=None,suggest=None):
        self.stars = stars
        self.role = role
        self.recomendation = recomendation
        self.improve = improve
        self.suggest = suggest
        

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Encuesta.query.count() == 0:
        # Crear registros de experiencias
        token1 = Encuesta(suggest='?')
        token2 = Encuesta(suggest='??')

        db.session.add_all([token1, token2])
        db.session.commit()

class EncuestaSchema(ma.Schema):
    class Meta:
        fields = ('stars', 'role','recomendation','improve','suggest')