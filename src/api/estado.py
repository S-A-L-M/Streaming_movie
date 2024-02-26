from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.estado import Estados, EstadosSchema

routes_estados = Blueprint("routes_estados", __name__)

# subcripcion
Estado_Schema = EstadosSchema()
Estado_Schema = EstadosSchema(many=True)
