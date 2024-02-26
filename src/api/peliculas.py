from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.peliculas import Peliculas,PeliculasSchema

routes_peliculas = Blueprint("routes_peliculas", __name__)

# subcripcion
Pelicula_Schema = PeliculasSchema()
Pelicula_Schema = PeliculasSchema(many=True)