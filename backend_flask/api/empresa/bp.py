from flask import Blueprint, jsonify, request
# Importamos la instancia individual y la de lista (muchas empresas)
from .schema import empresa_schema, empresas_schema 
from core.models import Empresa
from mongoengine.errors import ValidationError
from bson.errors import InvalidId

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
    
@bp.route('/empresas/<id>', methods=['GET'])
def get_empresa(id):
    try:
        empresa = Empresa.objects(id=id).first()
        if not empresa:
            return jsonify({"error": "Empresa no encontrada"}), 404
            
        return jsonify(empresa_schema.dump(empresa)), 200
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID de empresa inválido"}), 400


@bp.route('/empresas/<id>', methods=['PUT'])
def update_empresa(id):
    try:
        empresa = Empresa.objects(id=id).first()
        if not empresa:
            return jsonify({"error": "Empresa no encontrada"}), 404

        data = request.get_json()
        
        # Actualizamos dinámicamente cualquier campo que nos mande el frontend
        for key, value in data.items():
            # Evitamos sobreescribir el ID por accidente
            if key not in ['id', '_id']:
                setattr(empresa, key, value)
            
        empresa.save()
        return jsonify({"mensaje": "Empresa actualizada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/empresas/<id>', methods=['DELETE'])
def delete_empresa(id):
    try:
        empresa = Empresa.objects(id=id).first()
        if not empresa:
            return jsonify({"error": "Empresa no encontrada"}), 404
            
        empresa.delete()
        return jsonify({"mensaje": "Empresa eliminada correctamente"}), 200
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID de empresa inválido"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500