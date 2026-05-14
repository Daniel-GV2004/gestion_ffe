from flask import Blueprint, request, jsonify, send_file
from core.utils import generar_documento_en_memoria, procesar_anexo_oficial_junta
from core.models import Practica

bp = Blueprint('repositorio', __name__)

@bp.route('/generar', methods=['POST'])
def generar_documento():
    data = request.get_json()
    
    if not data or not data.get('docId'):
        return jsonify({"error": "Faltan datos de la plantilla"}), 400

    doc_id = data.get('docId')
    alumno_id = data.get('alumno_id')
    empresa_id = data.get('empresa_id')

    documentos_junta = ["Anexo II Plan formativo", "Anexo IV Informe valorativo"]

    try:
        if doc_id in documentos_junta:
            
            practica = Practica.objects(alumno=alumno_id).first()
            
            if not practica:
                return jsonify({"error": "No se encontró una práctica asociada a este alumno para generar el Anexo"}), 404
                
            archivo_memoria, alumno_obj = procesar_anexo_oficial_junta(doc_id, str(practica.id))
            
            nombre_descarga = f"{doc_id.replace(' ', '_')}_{alumno_obj.apellidos}.docx"

        else:
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
        print(f"Error generando documento: {str(e)}")
        return jsonify({"error": f"Error interno generando el documento: {str(e)}"}), 500