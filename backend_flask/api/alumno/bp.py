from flask import Blueprint, jsonify, request
from .schema import alumno_schema, alumnos_schema 
from core.models import Alumno
from mongoengine.errors import ValidationError
from bson.errors import InvalidId
from mongoengine.errors import NotUniqueError

bp = Blueprint('alumno', __name__)

@bp.route('/alumnos', methods=['GET'])
def get_alumnos():
    alumnos = Alumno.objects.all()
    result = alumnos_schema.dump(alumnos)
    return jsonify(result), 200

@bp.route('/alumnos', methods=['POST'])
def create_alumno():
    json_data = request.get_json()
    
    # 1. Validar
    errors = alumno_schema.validate(json_data)
    if errors:
        return jsonify({"errores": errors}), 400
    
    try:
        data = alumno_schema.load(json_data)
        nuevo_alumno = Alumno(**data)
        
        # 2. SE GUARDA EN MONGO (Esto te estaba funcionando bien)
        nuevo_alumno.save()
        
        # 3. EL ARREGLO: Empaquetar para el viaje de vuelta de forma segura
        result = alumno_schema.dump(nuevo_alumno)
        result['id'] = str(nuevo_alumno.id) # Convertimos el ID raro de Mongo a texto normal
        
        return jsonify(result), 201
        
    except NotUniqueError:
        return jsonify({"error": "Ese NIF/NIE ya está registrado en otro alumno"}), 400
    except Exception as e:
        # Añadimos este print para que, si falla, la terminal de Flask te chive el error exacto
        print("💥 ERROR EN POST /alumnos:", str(e))
        return jsonify({"error": str(e)}), 500
    
@bp.route('/alumnos/<id>', methods=['GET'])
def get_alumno(id):
    try:
        alumno = Alumno.objects(id=id).first()
        if not alumno:
            return jsonify({"error": "Alumno no encontrado"}), 404
            
        # Al tener el ID en el schema, ya no inyectamos nada a mano
        data = alumno_schema.dump(alumno)
        return jsonify(data), 200
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID inválido"}), 400

@bp.route('/alumnos/<id>', methods=['PUT'])
def update_alumno(id):
    try:
        alumno = Alumno.objects(id=id).first()
        if not alumno:
            return jsonify({"error": "Alumno no encontrado"}), 404

        data = request.get_json()
        for key, value in data.items():
            if key not in ['id', '_id']:
                setattr(alumno, key, value)
            
        alumno.save()
        return jsonify({"mensaje": "Alumno actualizado"}), 200
        
    except NotUniqueError: # <--- AÑADE ESTO
        return jsonify({"error": "Ese NIF/NIE ya está registrado en otro alumno"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/alumnos/<id>', methods=['DELETE'])
def delete_alumno(id):
    try:
        alumno = Alumno.objects(id=id).first()
        
        if not alumno:
            return jsonify({
                "error": "Alumno no encontrado",
                "id_buscado": id
            }), 404
            
        alumno.delete()
        
        # Usamos tu versión más detallada que es mejor
        return jsonify({
            "mensaje": f"Alumno '{alumno.nombre}' eliminado correctamente",
            "id_eliminado": id
        }), 200

    except (InvalidId, ValidationError):
        return jsonify({"error": "El ID proporcionado no es válido"}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500