import os.path
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Definimos los permisos (Scopes)
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get_sheets_service():
    """Autentica y devuelve el servicio de Google Sheets."""
    creds = None
    # Buscamos el token en la raíz del proyecto
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    token_path = os.path.join(root_dir, 'token_sheets.json')
    creds_path = os.path.join(root_dir, 'credentials.json')

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    return build('sheets', 'v4', credentials=creds)

def get_google_sheet_data(spreadsheet_id, range_name):
    """Obtiene los datos brutos de una hoja específica."""
    service = get_sheets_service()
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, 
        range=range_name
    ).execute()
    return result.get('values', [])