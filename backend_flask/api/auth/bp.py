from flask import Blueprint, jsonify
from core.utils import token_required

bp = Blueprint('auth', __name__)

@bp.route('/ping', methods=['GET'])
@token_required
def ping(current_user_id):
    return jsonify({
        "status": "active",
        "user_id": current_user_id
    }), 200