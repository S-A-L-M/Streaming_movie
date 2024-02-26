from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.inventario import Inventario, InventarioSchema

routes_inventario = Blueprint("routes_inventario", __name__)

# subcripcion
Inventario_Schema = InventarioSchema()
Inventario_Schema = InventarioSchema(many=True)
