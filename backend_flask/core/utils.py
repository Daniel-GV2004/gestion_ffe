import jwt
import datetime
from core.config import SECRET_KEY, SESSION_DURATION_HOURS, ALGORITHM

def generar_token(usuario_id):
    ahora = datetime.datetime.utcnow()
    payload = {
        # Fecha de emisión
        'iat': ahora,
        # Fecha de expiración (ahora + 2 horas)
        'exp': ahora + datetime.timedelta(hours=SESSION_DURATION_HOURS),
        # Identificador del usuario
        'sub': str(usuario_id)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header

        if not token:
            return jsonify({'error': 'Token ausente'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            current_user_id = data['sub']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'La sesión ha expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        return f(current_user_id, *args, **kwargs)

    return decorated