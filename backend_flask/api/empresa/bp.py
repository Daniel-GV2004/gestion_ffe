from flask import Blueprint, jsonify
import os
from ..services import get_google_sheet_data
from .schema import EmpresaSchema  # <--- Importamos el schema
from core.sheets_service import conectar_sheet

empresa_bp = Blueprint('empresa', __name__)


@empresa_bp.route('/datos-excel', methods=['GET'])
def obtener_datos_excel():
    try:
        # Pon el nombre EXACTO de tu archivo de Google Sheets
        sheet = conectar_sheet("empresas")
        
        # Obtener todos los registros como una lista de diccionarios
        # (Ideal para tablas en React)
        datos = sheet.get_all_records()
        
        return jsonify(datos), 200
    except Exception as e:
        print(f"❌ ERROR EN BACKEND: {str(e)}")
        return jsonify({"error": str(e), "tipo": "backend_error"}), 500     

@empresa_bp.route('/', methods=['GET'])
def listar_alumnos():
    try:
        sheet_id = os.getenv('SPREADSHEET_ID')
        range_name = os.getenv('RANGE_NAME', 'Hoja 1!A1:Z100')

        rows = get_google_sheet_data(sheet_id, range_name)

        if not rows or len(rows) < 1:
            return jsonify({"error": "No hay datos"}), 404

        headers = rows[0]
        data_rows = rows[1:]
        
        # 1. Convertimos a diccionarios básicos
        raw_data = [dict(zip(headers, row)) for row in data_rows]

        # 2. PASAMOS POR EL SCHEMA (Validación y Limpieza)
        # Esto filtrará emails inválidos y campos sobrantes
        result = EmpresaSchema.dump(raw_data)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500