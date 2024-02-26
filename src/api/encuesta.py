from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.encuesta import Encuesta, EncuestaSchema

routes_encuesta = Blueprint("routes_encuesta", __name__)

# subcripcion
Encuesta_Schema = EncuestaSchema()
Encuesta_Schema = EncuestaSchema(many=True)