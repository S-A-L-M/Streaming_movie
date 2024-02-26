from config.db import db, app, ma

class Ticket(db.Model):
    __tablename__ = "tbltickets"

    ticket_id = db.Column(db.Integer, primary_key=True)
    tipo_ayuda = db.Column(db.String(30), nullable=True, default=None)
    asunto = db.Column(db.String(40),nullable=True, default=None)
    descripcion = db.Column(db.String(200),nullable=True, default=None)
    imagen = db.Column(db.LargeBinary, nullable=True, default=None)

    

    def __init__(self, tipo_ayuda=None, asunto=None, descripcion=None,imagen=None):
        self.tipo_ayuda = tipo_ayuda
        self.asunto = asunto
        self.descripcion = descripcion
        self.imagen = imagen
        

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Ticket.query.count() == 0:
        # Crear registros de experiencias
        ticket1 = Ticket(tipo_ayuda=None, asunto=None, descripcion=None, imagen=None)
        ticket2 = Ticket(tipo_ayuda=None, asunto=None, descripcion=None, imagen=None)

        db.session.add_all([ticket1, ticket2])
        db.session.commit()

class TicketSchema(ma.Schema):
    class Meta:
        fields = ('tipo_ayuda', 'asunto','descripcion','imagen')