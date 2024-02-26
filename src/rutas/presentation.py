from config.db import db , ma , app
from flask import Blueprint , render_template,request,jsonify,session
from model.user import User, UserSchema  
import secrets
from datetime import datetime, timedelta    

routes_presentation = Blueprint("routes_presentation",__name__)

#creamos del registro
@routes_presentation.route("/indexpresentation" , methods=["GET"])
def indexpresentation():
    

    return render_template('/main/presentation.html')