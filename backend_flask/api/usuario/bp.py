# api/usuario/routes.py
from flask import Blueprint, request, jsonify
from core.models import Usuario
from mongoengine.errors import NotUniqueError

bp = Blueprint('usuario', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'nombre' not in data or 'password' not in data:
        return jsonify({"error": "Faltan credenciales"}), 400

    # Usamos el método de clase 'verificar' que definiste en tu modelo
    user = Usuario.verificar(nombre=data['nombre'], password=data['password'])
    
    if user:
        # El login en el frontend espera el 'nombre' para el estado global
        return jsonify({
            "mensaje": "Login exitoso",
            "nombre": user.nombre
        }), 200
    
    return jsonify({"error": "Usuario o contraseña incorrectos"}), 401

@bp.route('/register', methods=['POST'])
def register():
    """Ruta opcional por si necesitas crear usuarios desde la API"""
    data = request.get_json()
    try:
        user = Usuario.crear(nombre=data['nombre'], password=data['password'])
        return jsonify({"mensaje": "Usuario creado", "nombre": user.nombre}), 201
    except NotUniqueError:
        return jsonify({"error": "El nombre de usuario ya existe"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/usuarios', methods=['GET'])
def get_usuarios():
    from .schema import usuarios_schema
    usuarios = Usuario.objects.all()
    result = usuarios_schema.dump(usuarios)
    return jsonify(result), 200