from config.db import db, app, ma
from flask import Flask,  redirect, request, jsonify, json, session, render_template
from flask import Blueprint, request, jsonify, json

from model.ticket import Ticket, TicketSchema

routes_ticket = Blueprint("routes_ticket", __name__)

# ticket
Ticket_Schema = TicketSchema()
Ticket_Schema = TicketSchema(many=True)