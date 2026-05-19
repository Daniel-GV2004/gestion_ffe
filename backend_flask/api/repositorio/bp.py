from flask import Blueprint, request, jsonify, send_file
import json
from .utils import generar_documento_en_memoria, procesar_anexo_oficial_junta
from core.models import Practica 
from core.constants import etiquetas_centro
from core.utils import token_required

bp = Blueprint('repositorio', __name__)

@bp.route('/generar', methods=['POST'])
@token_required
def generar_documento(current_user_id):
    if request.is_json:
        data = request.get_json()
        doc_id = data.get('docId')
        alumno_id = data.get('alumno_id')
        empresa_id = data.get('empresa_id')
        practica_id = data.get('practicaId')
        nombre_profesor = data.get('usuario', {}).get('nombre')
        archivo_subido = None
    else:
        doc_id = request.form.get('docId')
        alumno_id_raw = request.form.get('alumno_id')
        alumno_id = json.loads(alumno_id_raw) if alumno_id_raw and '[' in alumno_id_raw else alumno_id_raw
        empresa_id = request.form.get('empresa_id')
        practica_id = request.form.get('practicaId') 
        nombre_profesor = request.form.get('usuario_nombre')
        archivo_subido = request.files.get('file')

    if not doc_id:
        return jsonify({"error": "Faltan datos de la plantilla"}), 400

    documentos_junta = ["Anexo II Plan formativo", "Anexo IV Informe valorativo"]

    try:
        if doc_id in documentos_junta:
            # MOTOR 1: Documentos Oficiales de la Junta (Requiere archivo)
            if not archivo_subido:
                return jsonify({"error": "Debes subir el archivo original de la Junta para este anexo"}), 400
            if not practica_id:
                return jsonify({"error": "Falta la práctica para generar este anexo"}), 400
            
            # Pasamos el archivo en memoria a la función
            archivo_memoria, alumno_obj = procesar_anexo_oficial_junta(archivo_subido, practica_id)
            nombre_descarga = f"{doc_id.replace(' ', '_')}_{alumno_obj.apellidos}.docx"

        else:
            # MOTOR 2: Tu motor avanzado XML (Lee de la carpeta local)
            datos_bd = {}
            if practica_id:
                practica = Practica.objects.get(id=practica_id)
                if not alumno_id and practica.alumno:
                    alumno_id = str(practica.alumno.id)
                if not empresa_id and practica.empresa:
                    empresa_id = str(practica.empresa.id)

            if alumno_id:
                datos_bd['alumnos' if isinstance(alumno_id, list) else 'alumno'] = alumno_id
            if empresa_id:
                datos_bd['empresa'] = empresa_id

            if not datos_bd:
                return jsonify({"error": "Debes proporcionar al menos un alumno, empresa o práctica"}), 400

            data_peticion = {
                "docId": doc_id,
                "usuario": {"nombre": nombre_profesor}
            }

            # Importante: Como tu motor lee de disco, NO le pasamos archivo_subido.
            archivo_memoria = generar_documento_en_memoria(data_peticion, datos_bd)
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
        print(f"💥 Error generando documento: {str(e)}")
        return jsonify({"error": f"Error interno generando el documento: {str(e)}"}), 500

@bp.route('/codigo-centro', methods=['GET'])
@token_required
def get_codigo_centro(current_user_id):
    try:
        datos_centro = etiquetas_centro()
        
        codigo = datos_centro.get("[CENTRO_CODIGO]", "Código no encontrado")
        
        return jsonify({"codigo": codigo}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error obteniendo el código: {str(e)}"}), 500