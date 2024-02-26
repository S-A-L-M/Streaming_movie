from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.experiencia import Experiencia, ExperienciasSchema

routes_experiencia = Blueprint("routes_experiencia", __name__)

# subcripcion
Experiencia_Schema = ExperienciasSchema()
Experiencia_Schema = ExperienciasSchema(many=True)