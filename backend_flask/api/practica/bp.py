from flask import Blueprint, jsonify, request
from .schema import practica_schema as PracticaSchema 
from core.models import Practica
from mongoengine.errors import ValidationError

bp = Blueprint('practica', __name__)

@bp.route('/practicas', methods=['GET'])
def get_practicas():
    practicas = Practica.objects.all()
    result = PracticaSchema.dump(practicas)
    return jsonify(result), 200

@bp.route('/practicas', methods=['POST'])
def create_practica():
    json_data = request.get_json()
    
    errors = PracticaSchema.validate(json_data)
    if errors:
        return jsonify(errors), 400
    
    data = PracticaSchema.load(json_data)
    
    try:
        nueva_practica = Practica(**data)
        nueva_practica.save()
        return PracticaSchema.jsonify(nueva_practica), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/practicas/<id>', methods=['DELETE'])
def delete_practica(id):
    try:
        practica = Practica.objects(id=id).first()
        
        if not practica:
            return jsonify({
                "error": "Práctica no encontrada",
                "id_buscado": id
            }), 404
            
        practica.delete()
        
        return jsonify({
            "mensaje": f"Práctica '{practica.alumno}' eliminada correctamente",
            "id_eliminado": id
        }), 200

    except ValidationError:
        return jsonify({"error": "El ID proporcionado no es válido"}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500