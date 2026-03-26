from flask import Blueprint, jsonify
from .schema import EmpresaSchema
from core.models import Empresa


bp = Blueprint('empresa', __name__)