from flask import Blueprint, jsonify, request
from .schema import empresa_schema, empresas_schema 
from core.models import Empresa
from mongoengine.errors import ValidationError
from bson.errors import InvalidId
from core.constants import etiquetas_centro
from core.utils import token_required

bp = Blueprint('empresa', __name__)

@bp.route('/empresas', methods=['GET'])
@token_required
def get_empresas():
    empresas = Empresa.objects.all()
    result = empresas_schema.dump(empresas)
    return jsonify(result), 200

@bp.route('/empresas', methods=['POST'])
@token_required
def create_empresa():
    json_data = request.get_json()
    
    datos_centro = etiquetas_centro()
    prefijo = f'{datos_centro["[CENTRO_CODIGO]"]}/'

    errors = empresa_schema.validate(json_data)
    if errors:
        print("Errores de validación Empresa:", errors)
        return jsonify({"errores": errors}), 400
    
    try:
        data = empresa_schema.load(json_data)
        
        nueva_empresa = Empresa(**data)
        nueva_empresa.save()
        
        codigo_generado = f'{prefijo}{nueva_empresa.numero_secuencia:04d}'
        
        nueva_empresa.codigo_acuerdo = codigo_generado
        nueva_empresa.save()
        
        result = empresa_schema.dump(nueva_empresa)
        result['id'] = str(nueva_empresa.id)
        
        return jsonify(result), 201
        
    except Exception as e:
        print(f"Error en POST /empresas: {e}")
        return jsonify({"error": str(e)}), 500
    
@bp.route('/empresas/<id>', methods=['GET'])
@token_required
def get_empresa(id):
    try:
        empresa = Empresa.objects(id=id).first()
        if not empresa:
            return jsonify({"error": "Empresa no encontrada"}), 404
            
        return jsonify(empresa_schema.dump(empresa)), 200
    except (InvalidId, ValidationError):
        return jsonify({"error": "ID de empresa inválido"}), 400


@bp.route('/empresas/<id>', methods=['PUT'])
@token_required
def update_empresa(id):
    try:
        empresa = Empresa.objects(id=id).first()
        if not empresa:
            return jsonify({"error": "Empresa no encontrada"}), 404

        data = request.get_json()
        
        for key, value in data.items():
            if key not in ['id', '_id']:
                setattr(empresa, key, value)
            
        empresa.save()
        return jsonify({"mensaje": "Empresa actualizada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route('/empresas/<id>', methods=['DELETE'])
@token_required
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