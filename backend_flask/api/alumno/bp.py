from flask import Blueprint, jsonify, request
from .schema import alumno_schema, alumnos_schema 
from core.models import Alumno
from mongoengine.errors import ValidationError
from bson.errors import InvalidId
from mongoengine.errors import NotUniqueError
from .utils import calcular_curso
from core.utils import token_required

bp = Blueprint('alumno', __name__)

@bp.route('/alumnos', methods=['GET'])
@token_required
def get_alumnos(current_user_id):
    alumnos = Alumno.objects.all()
    result = alumnos_schema.dump(alumnos)
    return jsonify(result), 200

@bp.route('/alumnos', methods=['POST'])
@token_required
def create_alumno(current_user_id):
    json_data = request.get_json()
    
    # 1. Validar
    errors = alumno_schema.validate(json_data)
    if errors:
        return jsonify({"errores": errors}), 400
    
    try:
        data = alumno_schema.load(json_data)
        nuevo_alumno = Alumno(**data)
        
        # ASIGNACIÓN AUTOMÁTICA DEL CURSO EN LA CREACIÓN
        nuevo_alumno.curso = calcular_curso()
        
        # 2. SE GUARDA EN MONGO
        nuevo_alumno.save()
        
        # 3. EL ARREGLO: Empaquetar para el viaje de vuelta
        result = alumno_schema.dump(nuevo_alumno)
        result['id'] = str(nuevo_alumno.id)
        
        return jsonify(result), 201
        
    except NotUniqueError:
        return jsonify({"error": "Ese NIF/NIE ya está registrado en otro alumno"}), 400
    except Exception as e:
        print("💥 ERROR EN POST /alumnos:", str(e))
        return jsonify({"error": str(e)}), 500
    
@bp.route('/alumnos/<id>', methods=['GET'])
@token_required
def get_alumno(current_user_id, id):
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
@token_required
def update_alumno(current_user_id, id):
    try:
        alumno = Alumno.objects(id=id).first()
        if not alumno:
            return jsonify({"error": "Alumno no encontrado"}), 404

        data = request.get_json()
        for key, value in data.items():
            # Evitamos que el front sobrescriba el id o el curso manualmente
            if key not in ['id', '_id', 'curso']: 
                setattr(alumno, key, value)
        
        # ACTUALIZACIÓN AUTOMÁTICA DEL CURSO AL EDITAR (Por si repite)
        alumno.curso = calcular_curso()
        
        alumno.save()
        return jsonify({"mensaje": "Alumno actualizado"}), 200
        
    except NotUniqueError: 
        return jsonify({"error": "Ese NIF/NIE ya está registrado en otro alumno"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@bp.route('/alumnos/<id>', methods=['DELETE'])
@token_required
def delete_alumno(current_user_id, id):
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