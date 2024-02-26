from config.db import db , ma , app
from flask import Blueprint , render_template,request,jsonify,session

routes_cancelledpayment = Blueprint("routes_cancelledpayment",__name__)

#creamos la ruta del home
@routes_cancelledpayment.route("/indexcancelledpayment" , methods=["GET"])
def indexcancelledpayment():
    return render_template('/main/cancelled-payment.html')
