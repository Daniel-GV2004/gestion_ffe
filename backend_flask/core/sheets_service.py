# core/sheets_service.py
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os

def conectar_sheet(nombre_excel):
    # 1. Definir los permisos
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    
    # 2. Cargar el JSON (Asegúrate de que la ruta sea correcta)
    # Si credentials.json está en la misma carpeta que este archivo:
    path_json = os.path.join(os.path.dirname(__file__), 'credentials.json')
    
    try:
        creds = ServiceAccountCredentials.from_json_keyfile_name(path_json, scope)
        # 3. Autorizar el cliente
        client = gspread.authorize(creds)
        
        # 4. Abrir el excel y devolver la PRIMERA HOJA
        sheet = client.open(nombre_excel).sheet1 
        return sheet # <--- Esto debe devolver un objeto de gspread, no una respuesta HTTP
        
    except Exception as e:
        print(f"Error en sheets_service: {e}")
        raise e