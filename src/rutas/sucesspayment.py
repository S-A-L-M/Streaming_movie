from config.db import db , ma , app
from flask import Blueprint , render_template,request,jsonify,session

routes_sucesspayment = Blueprint("routes_sucesspayment",__name__)

#creamos la ruta del home
@routes_sucesspayment.route("/indexverifyingpayment" , methods=["GET"])
def indexverifyingpayment():
    return render_template('/main/success-payment.html')
