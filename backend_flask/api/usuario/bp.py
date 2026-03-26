# api/usuario/routes.py
from flask import Blueprint, request, jsonify
from api.usuario.model import Usuario

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    nombre = data.get('nombre')
    password = data.get('password')

    user = Usuario.verificar(nombre, password)
    
    if user:
        # No enviamos el password al front por seguridad
        return jsonify({
            "status": "success",
            "nombre": user['nombre']
        }), 200
    
    return jsonify({"status": "error", "message": "Usuario o contraseña incorrectos"}), 401

@usuario_bp.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    nombre = data.get('nombre')
    password = data.get('password')

    if not nombre or not password:
        return jsonify({"mensaje": "Faltan datos obligatorios"}), 400

    # Llamamos al método crear de tu modelo (el que usa generate_password_hash)
    try:
        Usuario.crear(nombre, password)
        return jsonify({"mensaje": "Usuario creado con éxito"}), 201
    except Exception as e:
        return jsonify({"mensaje": "Error al crear usuario", "error": str(e)}), 500