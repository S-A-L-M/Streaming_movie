from config.db import db, app, ma

class Notificacion(db.Model):
    __tablename__ = "tblnotificaciones"

    notificacion_id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(30))
    descripcion = db.Column(db.Text)
    

    def __init__(self, titulo, descripcion):
        self.titulo = titulo
        self.descripcion = descripcion
        

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Notificacion.query.count() == 0:
        # Crear registros de experiencias
        experiencia1 = Notificacion(titulo="Enhorabuena", descripcion="Tu cuenta ha sido creada Satisfactoriamente")
        experiencia2 = Notificacion(titulo="Enhorabuena", descripcion="Tu cuenta ha sido creada Satisfactoriamente")

        db.session.add_all([experiencia1, experiencia2])
        db.session.commit()

class NotificacionSchema(ma.Schema):
    class Meta:
        fields = ('titulo', 'descripcion')