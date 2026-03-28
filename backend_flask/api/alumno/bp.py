from flask import Blueprint, jsonify, request
# Importamos AMBAS instancias: la individual y la de lista
from .schema import alumno_schema, alumnos_schema 
from core.models import Alumno
from mongoengine.errors import ValidationError

bp = Blueprint('alumno', __name__)

@bp.route('/alumnos', methods=['GET'])
def get_alumnos():
    alumnos = Alumno.objects.all()
    # ERROR CORREGIDO: Usamos 'alumnos_schema' (plural) para listas
    result = alumnos_schema.dump(alumnos)
    return jsonify(result), 200

@bp.route('/alumnos', methods=['POST'])
def create_alumno():
    json_data = request.get_json()
    
    # 1. Validar usando la instancia individual
    errors = alumno_schema.validate(json_data)
    if errors:
        # Esto te devolverá exactamente qué campo falta o está mal
        return jsonify(errors), 400
    
    try:
        # 2. Cargar datos (aplica data_keys y quita campos extra)
        data = alumno_schema.load(json_data)
        
        # 3. Guardar en Mongo con el modelo
        nuevo_alumno = Alumno(**data)
        nuevo_alumno.save()
        
        # ERROR CORREGIDO: Usamos dump + jsonify en lugar de .jsonify()
        result = alumno_schema.dump(nuevo_alumno)
        return jsonify(result), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/alumnos/<id>', methods=['DELETE'])
def delete_alumno(id):
    try:
        # Buscar por ID de Mongo
        alumno = Alumno.objects(id=id).first()
        
        if not alumno:
            return jsonify({
                "error": "Alumno no encontrado",
                "id_buscado": id
            }), 404
            
        alumno.delete()
        
        return jsonify({
            "mensaje": f"Alumno '{alumno.nombre}' eliminado correctamente",
            "id_eliminado": id
        }), 200

    except ValidationError:
        return jsonify({"error": "El ID proporcionado no es válido"}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500