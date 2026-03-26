from flask import Blueprint, jsonify
from .schema import practica_schema  
from core.models import Practica

bp = Blueprint('practica', __name__)