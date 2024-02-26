from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.user import User, UserSchema

routes_user = Blueprint("routes_user", __name__)

# usuario
User_Schema = UserSchema()
User_Schema = UserSchema(many=True)
