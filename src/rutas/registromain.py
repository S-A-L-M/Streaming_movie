from config.db import db , ma , app
from flask import Blueprint , render_template,request,jsonify,session

routes_RegistroMain = Blueprint("routes_RegistroMain",__name__)

#creamos la ruta del home
@routes_RegistroMain.route("/indexregistromain" , methods=["GET"])
def indexregistromain():
    return render_template('/main/registro-main.html')