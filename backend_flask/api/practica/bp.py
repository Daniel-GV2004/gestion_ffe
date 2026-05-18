from flask import Blueprint, jsonify, request
from .schema import practica_schema, practicas_schema 
from core.models import Practica, Alumno, Empresa
from bson import ObjectId
from bson.errors import InvalidId
from mongoengine.errors import ValidationError
from core.utils import token_required

bp = Blueprint('practica', __name__)

@bp.route('/practicas', methods=['GET'])
@token_required
def get_practicas():
    practicas = Practica.objects.all().select_related(2)
    
    result = []
    for p in practicas:
        item = practica_schema.dump(p)
        item['alumno'] = f"{p.alumno.nombre} {p.alumno.apellidos}" if p.alumno else "Sin Alumno"
        item['empresa'] = p.empresa.nombre_empresa if p.empresa else "Sin Empresa"
        item['id'] = str(p.id) 
        result.append(item)
        
    return jsonify(result), 200

@bp.route('/practicas', methods=['POST'])
@token_required
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
    

@bp.route('/practicas/<id>', methods=['GET'])
@token_required
def get_practica(id):
    try:
        practica = Practica.objects(id=id).first()
        if not practica:
            return jsonify({"error": "Práctica no encontrada"}), 404
            
        data = practica_schema.dump(practica)
        
        data['id'] = str(practica.id)
        data['alumno'] = str(practica.alumno.id) if practica.alumno else ""
        data['empresa'] = str(practica.empresa.id) if practica.empresa else ""

        return jsonify(data), 200
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID de práctica inválido"}), 400


@bp.route('/practicas/<id>', methods=['PUT'])
@token_required
def update_practica(id):
    try:
        practica = Practica.objects(id=id).first()
        if not practica:
            return jsonify({"error": "Práctica no encontrada"}), 404

        data = request.get_json()
        
        for key, value in data.items():
            if key not in ['id', '_id']:
                if key in ['alumno', 'empresa'] and value:
                    setattr(practica, key, ObjectId(value))
                else:
                    setattr(practica, key, value)
            
        practica.save()
        return jsonify({"mensaje": "Práctica actualizada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/practicas/<id>', methods=['DELETE'])
@token_required
def delete_practica(id):
    try:
        practica = Practica.objects(id=id).first()
        if not practica:
            return jsonify({"error": "Práctica no encontrada"}), 404
            
        practica.delete()
        return jsonify({"mensaje": "Práctica eliminada correctamente"}), 200
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID de práctica inválido"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500