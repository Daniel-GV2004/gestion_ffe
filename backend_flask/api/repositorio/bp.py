from flask import Blueprint, request, jsonify, send_file
from marshmallow import ValidationError

# Ajusta las importaciones según dónde hayas guardado el schema y el core
from .schema import RepositorioSchema
from core.utils import generar_documento_en_memoria

bp = Blueprint('repositorio', __name__)

@bp.route('/generar', methods=['POST'])
def generar_documento():
    # Instanciamos tu schema (opción 1)
    schema = RepositorioSchema()
    
    try:
        # 1. Validar el JSON que llega desde React
        datos_validados = schema.load(request.json)
    except ValidationError as err:
        # Si falta el NIF, el docId está mal escrito, etc., Flask avisa a React.
        return jsonify({"errores": err.messages}), 400

    doc_id = datos_validados['docId']
    
    try:
        # 2. Llamar al core para procesar el Word
        archivo_memoria = generar_documento_en_memoria(datos_validados)
        
        # 3. Preparar el nombre con el que se le descargará al usuario
        # Ej: Anexo_I_Modelo_Acuerdo_12345678Z.docx
        nombre_limpio = doc_id.replace(' ', '_')
        identificador = datos_validados['identificador']
        nombre_descarga = f"{nombre_limpio}_{identificador}.docx"
        
        # 4. Enviar el archivo como adjunto
        return send_file(
            archivo_memoria,
            as_attachment=True,
            download_name=nombre_descarga,
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
    except FileNotFoundError as fnf_error:
        return jsonify({"error": str(fnf_error)}), 404
    except Exception as e:
        # Capturar cualquier otro error (ej: el archivo Word está corrupto)
        return jsonify({"error": f"Error interno generando el documento: {str(e)}"}), 500