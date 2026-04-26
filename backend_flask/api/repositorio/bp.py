from flask import Blueprint, request, jsonify, send_file
from core.utils import generar_documento_en_memoria

bp = Blueprint('repositorio', __name__)

@bp.route('/generar', methods=['POST'])
def generar_documento():
    data = request.get_json()
    
    if not data or not data.get('docId'):
        return jsonify({"error": "Faltan datos de la plantilla"}), 400

    doc_id = data.get('docId')
    alumno_id = data.get('alumno_id')
    empresa_id = data.get('empresa_id')

    datos_bd = {}

    if alumno_id:
        if isinstance(alumno_id, list):
            datos_bd['alumnos'] = alumno_id
        else:
            datos_bd['alumno'] = alumno_id

    if empresa_id:
        datos_bd['empresa'] = empresa_id

    if not datos_bd:
        return jsonify({"error": "Debes proporcionar al menos un alumno o una empresa"}), 400

    try:
        archivo_memoria = generar_documento_en_memoria(data, datos_bd)
            
        nombre_descarga = f"{doc_id.replace(' ', '_')}.docx"
        
        return send_file(
            archivo_memoria,
            as_attachment=True,
            download_name=nombre_descarga,
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
    except FileNotFoundError as fnf_error:
        return jsonify({"error": str(fnf_error)}), 404
    except Exception as e:
        return jsonify({"error": f"Error interno generando el documento: {str(e)}"}), 500