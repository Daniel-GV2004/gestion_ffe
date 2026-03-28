from flask import Blueprint, jsonify, request
# Importamos la instancia individual y la de lista (muchas empresas)
from .schema import empresa_schema, empresas_schema 
from core.models import Empresa
from mongoengine.errors import ValidationError

bp = Blueprint('empresa', __name__)

@bp.route('/empresas', methods=['GET'])
def get_empresas():
    # 1. Obtenemos todas las empresas de MongoDB
    empresas = Empresa.objects.all()
    # 2. ERROR CORREGIDO: Usamos la instancia plural (many=True)
    result = empresas_schema.dump(empresas)
    return jsonify(result), 200

@bp.route('/empresas', methods=['POST'])
def create_empresa():
    json_data = request.get_json()
    
    # 1. Validar datos recibidos
    errors = empresa_schema.validate(json_data)
    if errors:
        # Imprime esto en tu consola de Flask para ver por qué falla si da 400
        print("Errores de validación Empresa:", errors)
        return jsonify(errors), 400
    
    try:
        # 2. Cargar datos (aplica data_key y limpia campos extra)
        data = empresa_schema.load(json_data)
        
        # 3. Guardar en MongoEngine
        nueva_empresa = Empresa(**data)
        nueva_empresa.save()
        
        # 4. ERROR CORREGIDO: Usamos dump + jsonify (Marshmallow estándar)
        result = empresa_schema.dump(nueva_empresa)
        return jsonify(result), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/empresas/<id>', methods=['DELETE'])
def delete_empresa(id):
    try:
        empresa = Empresa.objects(id=id).first()
        
        if not empresa:
            return jsonify({
                "error": "Empresa no encontrada",
                "id_buscado": id
            }), 404
            
        nombre = empresa.nombre_empresa  # Guardamos el nombre antes de borrar
        empresa.delete()
        
        return jsonify({
            "mensaje": f"Empresa '{nombre}' eliminada correctamente",
            "id_eliminado": id
        }), 200

    except ValidationError:
        return jsonify({"error": "El ID proporcionado no es válido"}), 400
    except Exception as e:
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500