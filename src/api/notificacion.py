from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.notificacion import Notificacion, NotificacionSchema

routes_notificacion = Blueprint("routes_notificacion", __name__)

# subcripcion
Notificacion_Schema = NotificacionSchema()
Notificacion_Schema = NotificacionSchema(many=True)