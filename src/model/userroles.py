from config.db import db, app, ma

class UserRoles(db.Model):
    __tablename__ = "tblusersroles"

    rol_id = db.Column(db.Integer, primary_key=True)
    rol_name = db.Column(db.String(200), unique=True)

    def __init__(self, rol_name):
        self.rol_name = rol_name

# Crear roles iniciales al iniciar la aplicación
with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if UserRoles.query.count() == 0:
        # Crear roles
        roles = [UserRoles('Admin'), UserRoles('Operador'), UserRoles('Cliente')]

        # Agregar roles a la sesión y hacer commit
        db.session.add_all(roles)
        db.session.commit()

class UserRolesSchema(ma.Schema):
    class Meta:
        fields = ('rol_id', 'rol_name')
