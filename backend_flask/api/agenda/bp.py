from flask import Blueprint, jsonify, request
from .schema import agenda_schema, agendas_schema 
from core.models import Agenda
from mongoengine.errors import ValidationError, NotUniqueError
from bson.errors import InvalidId

bp = Blueprint('agenda', __name__)

@bp.route('/', methods=['GET'])
def get_agendas():
    agendas = Agenda.objects.all()
    result = agendas_schema.dump(agendas)
    return jsonify(result), 200

@bp.route('/', methods=['POST'])
def create_agenda():
    json_data = request.get_json()
    
    errors = agenda_schema.validate(json_data)
    if errors:
        return jsonify({"errores": errors}), 400
    try:
        data = agenda_schema.load(json_data)
        nueva_agenda = Agenda(**data)
        
        nueva_agenda.save()

        result = agenda_schema.dump(nueva_agenda)
        result['id'] = str(nueva_agenda.id)
        
        return jsonify(result), 201

    except Exception as e:
        print("ERROR EN POST /agendas:", str(e))
        return jsonify({"error": str(e)}), 500
    
@bp.route('/<id>', methods=['GET'])
def get_agenda(id):
    try:
        agenda = Agenda.objects(id=id).first()
        if not agenda:
            return jsonify({"error": "Agenda no encontrada"}), 404
        data = agenda_schema.dump(agenda)
        return jsonify(data), 200
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID inválido"}), 400

@bp.route('/<id>', methods=['PUT'])
def update_agenda(id):
    try:
        agenda = Agenda.objects(id=id).first()
        if not agenda:
            return jsonify({"error": "Agenda no encontrada"}), 404

        json_data = request.get_json()
        
        errors = agenda_schema.validate(json_data, partial=True)
        if errors:
            return jsonify({"errores": errors}), 400
            
        data = agenda_schema.load(json_data, partial=True)

        for key, value in data.items():
            setattr(agenda, key, value)
            
        agenda.save()
        return jsonify({"mensaje": "Agenda actualizada"}), 200
        
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID inválido"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/<id>', methods=['DELETE'])
def delete_agenda(id):
    try:
        agenda = Agenda.objects(id=id).first()
        
        if not agenda:
            return jsonify({
                "error": "Agenda no encontrada",
                "id_buscado": id
            }), 404
            
        agenda.delete()
        
        return jsonify({
            "mensaje": f"Agenda '{agenda.nombre}' eliminada correctamente",
            "id_eliminado": id
        }), 200
        
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID inválido"}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500