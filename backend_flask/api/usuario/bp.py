# api/usuario/routes.py
from flask import Blueprint, request, jsonify
from core.models import Usuario

bp = Blueprint('usuario', __name__)

