from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.cupon import Cupones, CuponesSchema

routes_cupon = Blueprint("routes_cupon", __name__)

# cupon
Cupon_Schema = CuponesSchema()
Cupon_Schema = CuponesSchema(many=True)