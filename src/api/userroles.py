from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.userroles import UserRoles, UserRolesSchema

routes_userroles = Blueprint("routes_userroles", __name__)

# userroles
UserRoles_Schema = UserRolesSchema()
UserRoles_Schema = UserRolesSchema(many=True)
