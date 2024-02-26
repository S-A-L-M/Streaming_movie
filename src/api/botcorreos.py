from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.botcorreo import BotCorreos, BotCorreosSchema

routes_botcorreos = Blueprint("routes_botcorreos", __name__)

# cuenta
BotCorreo_Schema = BotCorreosSchema()
BotCorreo_Schema = BotCorreosSchema(many=True)