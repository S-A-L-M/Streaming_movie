from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.cuenta import Cuentas, CuentasSchema

routes_cuenta = Blueprint("routes_cuenta", __name__)

# cuenta
Cuenta_Schema = CuentasSchema()
Cuenta_Schema = CuentasSchema(many=True)
