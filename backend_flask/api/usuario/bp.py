from flask import Blueprint, request, jsonify
from core.models import Usuario
from mongoengine.errors import NotUniqueError, ValidationError as MongoValidationError
from bson.errors import InvalidId
from marshmallow import ValidationError
from .schema import usuario_schema
from core.utils import token_required

bp = Blueprint('usuario', __name__)

@bp.route('/register', methods=['POST'])
@token_required
def register(current_user_id):
    try:
        data = usuario_schema.load(request.get_json())
        
        user = Usuario.crear(
            nombre=data['nombre'], 
            password=data['password'],
            grados=data.get('grados', [])
        )
        return jsonify({"mensaje": "Usuario creado", "nombre": user.nombre}), 201
        
    except ValidationError as err:
        return jsonify({"errores": err.messages}), 400
    except NotUniqueError:
        return jsonify({"error": "El nombre de usuario ya existe"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/usuarios', methods=['GET'])
@token_required
def get_usuarios(current_user_id):
    usuarios = Usuario.objects.all()
    result = []
    for u in usuarios:
        user_data = usuario_schema.dump(u)
        user_data['id'] = str(u.id)
        result.append(user_data)
        
    return jsonify(result), 200


@bp.route('/usuarios/<id>', methods=['GET'])
@token_required
def get_usuario(current_user_id, id):
    try:
        user = Usuario.objects(id=id).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        user_data = usuario_schema.dump(user)
        user_data['id'] = str(user.id)
        return jsonify(user_data), 200
        
    except (InvalidId, MongoValidationError):
        return jsonify({"error": "ID de usuario inválido"}), 400


@bp.route('/usuarios/<id>', methods=['PUT'])
@token_required
def update_usuario(current_user_id, id):
    data = request.get_json()
    
    try:
        user = Usuario.objects(id=id).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if 'nombre' in data and data['nombre'].strip():
            user.nombre = data['nombre']
        
        if 'password' in data and data['password'].strip():
            user.set_password(data['password'])
            
        if 'grados' in data and isinstance(data['grados'], list):
            user.grados = data['grados']

        user.save()
        return jsonify({"mensaje": "Usuario actualizado correctamente"}), 200

    except NotUniqueError:
        return jsonify({"error": "Ese nombre de usuario ya está ocupado"}), 400
    except (InvalidId, MongoValidationError):
        return jsonify({"error": "ID de usuario inválido"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/usuarios/<id>', methods=['DELETE'])
@token_required
def delete_usuario(current_user_id, id):
    try:
        user = Usuario.objects(id=id).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
            
        user.delete()
        return jsonify({"mensaje": "Usuario eliminado correctamente"}), 200
        
    except (InvalidId, MongoValidationError):
        return jsonify({"error": "ID de usuario inválido"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500