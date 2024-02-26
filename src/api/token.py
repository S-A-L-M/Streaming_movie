from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.token import Token, TokensSchema

routes_token = Blueprint("routes_token", __name__)

# subcripcion
Token_Schema = TokensSchema()
Token_Schema = TokensSchema(many=True)