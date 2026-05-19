import jwt
import datetime
from flask import Blueprint, request, jsonify, current_app
from core.models import Usuario
from core.utils import token_required
from core.config import SECRET_KEY

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'nombre' not in data or 'password' not in data:
        return jsonify({"error": "Faltan credenciales"}), 400

    user = Usuario.verificar(nombre=data['nombre'], password=data['password'])
    
    if user:
        # Generar el Token de 2 horas
        ahora = datetime.datetime.utcnow()
        payload = {
            'iat': ahora,
            'exp': ahora + datetime.timedelta(hours=2),
            'sub': str(user.id)
        }
        
        # Encriptamos el token con la clave secreta de la app
        token = jwt.encode(
            payload, 
            current_app.config.get('SECRET_KEY', 'una_clave_secreta_por_defecto_12345'), 
            algorithm='HS256'
        )
        
        return jsonify({
            "mensaje": "Login exitoso",
            "nombre": user.nombre,
            "id": str(user.id),
            "grados": user.grados,
            "token": token
        }), 200
    
    return jsonify({"error": "Usuario o contraseña incorrectos"}), 401


@bp.route('/ping', methods=['GET'])
@token_required
def ping(current_user_id):
    """Endpoint para que el frontend compruebe si el token sigue vivo"""
    return jsonify({
        "status": "active",
        "user_id": current_user_id
    }), 200