from flask import Blueprint, jsonify, request
from .schema import practica_schema, practicas_schema 
from core.models import Practica, Alumno, Empresa
from bson import ObjectId

bp = Blueprint('practica', __name__)

@bp.route('/practicas', methods=['GET'])
def get_practicas():
    practicas = Practica.objects.all().select_related(2)
    
    result = []
    for p in practicas:
        item = practica_schema.dump(p)
        item['alumno'] = f"{p.alumno.nombre} {p.alumno.apellidos}"
        item['empresa'] = p.empresa.nombre_empresa
        result.append(item)
        
    return jsonify(result), 200

@bp.route('/practicas', methods=['POST'])
def create_practica():
    json_data = request.get_json()
    
    errors = practica_schema.validate(json_data)
    if errors:
        return jsonify(errors), 400
    
    try:
        data = practica_schema.load(json_data)
        
        data['alumno'] = ObjectId(data['alumno'])
        data['empresa'] = ObjectId(data['empresa'])
        
        nueva_practica = Practica(**data)
        nueva_practica.save()
        
        return jsonify({"mensaje": "Práctica creada"}), 201
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500