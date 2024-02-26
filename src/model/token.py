from config.db import db, app, ma

class Token(db.Model):
    __tablename__ = "tbltokens"

    token_id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(200),nullable=True, default=None,unique=True)
    ip = db.Column(db.Integer, nullable=True, default=None)
    dispositivo = db.Column(db.String(200),nullable=True, default=None)
    

    def __init__(self, token=None, ip=None, dispositivo=None):
        self.token = token
        self.ip = ip
        self.dispositivo = dispositivo
        

with app.app_context():
    db.create_all()

    # Verificar si ya hay registros en la tabla
    if Token.query.count() == 0:
        # Crear registros de experiencias
        token1 = Token(token='?', ip=0, dispositivo='?')
        token2 = Token(token='??', ip=0, dispositivo='?')

        db.session.add_all([token1, token2])
        db.session.commit()

class TokensSchema(ma.Schema):
    class Meta:
        fields = ('token', 'ip','dispositivo')
