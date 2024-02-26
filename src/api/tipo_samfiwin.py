from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.tipo_samfiwin import TipoSamfiWin,TipoSamfiWinSchema

routes_tiposamfiwin = Blueprint("routes_tiposamfiwin", __name__)

# tipo
TipoSamfiWin_Schema = TipoSamfiWinSchema()
TipoSamfiWin_Schema = TipoSamfiWinSchema(many=True)