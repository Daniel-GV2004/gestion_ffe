from flask import Blueprint, jsonify
from .schema import alumnos_schema 
from core.models import Alumno

bp = Blueprint('alumno', __name__)
