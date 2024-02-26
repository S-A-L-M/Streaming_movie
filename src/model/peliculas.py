from config.db import db, app, ma

class Peliculas(db.Model):
    __tablename__ = "tblpeliculas"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200))
    genero = db.Column(db.String(200))
    moviid = db.Column(db.Integer)
    edad_genero = db.Column(db.String(200))
    duracion = db.Column(db.Integer)
    description = db.Column(db.Text(200))
    elencos = db.Column(db.String(200))
    dirigido_por = db.Column(db.String(200))
    year = db.Column(db.Integer)
    trailer_creados1 = db.Column(db.String(200))
    trailer_creados2 = db.Column(db.String(200), default=None, nullable=True)
    trailer_creados3 = db.Column(db.String(200), default=None, nullable=True)
    url = db.Column(db.String(200))
  
    
    

    def __init__(self,nombre, genero, moviid, edad_genero, duracion, description, elencos, dirigido_por, year, trailer_creados1, trailer_creados2, trailer_creados3,url):
        self.genero = nombre
        self.genero = genero
        self.moviid = moviid
        self.edad_genero = edad_genero
        self.duracion = duracion
        self.description = description
        self.elencos = elencos
        self.dirigido_por = dirigido_por
        self.year = year
        self.trailer_creados1 = trailer_creados1
        self.trailer_creados2 = trailer_creados2
        self.trailer_creados3 = trailer_creados3
        self.url = url
        

with app.app_context():
    db.create_all()

class PeliculasSchema(ma.Schema):
    class Meta:
        fields = ('nombre','genero', 'moviid', 'edad_genero', 'description', 'dirigido_por','elencos', 'year', 'trailer_creados1', 'trailer_creados2', 'trailer_creados3','url')