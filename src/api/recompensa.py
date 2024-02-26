from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.recompensa import Recompensas, RecompensasSchema

routes_recompensa = Blueprint("routes_recompensa", __name__)

# Recompensa
Recompensa_Schema = RecompensasSchema()
Recompensa_Schema = RecompensasSchema(many=True)
