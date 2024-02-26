from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.samfiwin import SamfiWin, SamfiWinSchema

routes_samfiwin = Blueprint("routes_samfiwin", __name__)

# subcripcion
SamfiWin_Schema = SamfiWinSchema()
SamfiWin_Schema = SamfiWinSchema(many=True)