from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.subcripcion import Subcripcion, SubcripcionSchema

routes_subcripcion = Blueprint("routes_subcripcion", __name__)

# subcripcion
Subcripcion_Schema = SubcripcionSchema()
Subcripcion_Schema = SubcripcionSchema(many=True)
