from config.db import db , ma , app
from flask import Blueprint , render_template,request,jsonify,session

routes_profile = Blueprint("routes_profile",__name__)

#creamos la ruta del home
@routes_profile.route("/indexprofile" , methods=["GET"])
def indexprofile():
    return render_template('/main/Profile.html')
