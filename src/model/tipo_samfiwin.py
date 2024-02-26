from config.db import db, app, ma

class TipoSamfiWin(db.Model):
    __tablename__ = "tbltiposamfiwin"

    tiposamfiwin_id = db.Column(db.Integer, primary_key=True)
    tipo_samfiwin = db.Column(db.String(50), unique=True)

    def __init__(self, tipo_samfiwin):
        self.tipo_samfiwin = tipo_samfiwin

# Crear roles iniciales al iniciar la aplicación
with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if TipoSamfiWin.query.count() == 0:
        # Crear tipos
        tipo_Samfiwin = [TipoSamfiWin('eWin'), TipoSamfiWin('Recompensa'), TipoSamfiWin('Cupon')]

        # Agregar roles a la sesión y hacer commit
        db.session.add_all(tipo_Samfiwin)
        db.session.commit()

class TipoSamfiWinSchema(ma.Schema):
    class Meta:
        fields = ('tipo_samfiwin',)
