from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.perfil import Perfiles, PerfilesSchema

routes_perfiles = Blueprint("routes_perfiles", __name__)

# subcripcion
Perfil_Schema = PerfilesSchema()
Perfil_Schema = PerfilesSchema(many=True)