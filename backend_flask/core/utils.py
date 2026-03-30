import os
import io
from docx import Document

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLANTILLAS_DIR = os.path.join(BASE_DIR, 'plantillas_word')

def generar_documento_en_memoria(datos):
    doc_id = datos['docId']
    tipo_id = datos['tipo_identificador'].upper() # 'NIF' o 'CIF'
    valor_id = datos['identificador']

    # 1. Construir la ruta del archivo (Asegúrate de que todos sean .docx)
    ruta_plantilla = os.path.join(PLANTILLAS_DIR, f"{doc_id}.docx")
    
    if not os.path.exists(ruta_plantilla):
        raise FileNotFoundError(f"No se ha encontrado la plantilla: {doc_id}.docx")

    # 2. Abrir el documento Word
    doc = Document(ruta_plantilla)

    # 3. Modificar el documento. 
    # Aquí buscamos una etiqueta en tu Word, por ejemplo "[ID_USUARIO]" o "[NIF]"
    # y la cambiamos por el valor real.
    for paragraph in doc.paragraphs:
        # Esto es un reemplazo básico. Si en tu Word pones el texto [IDENTIFICADOR]
        if '[IDENTIFICADOR]' in paragraph.text:
            paragraph.text = paragraph.text.replace('[IDENTIFICADOR]', valor_id)
            
        # Opcional: Puedes usar el 'tipo_id' para poner algo como "NIF: 12345678Z"
        if '[TIPO_Y_NUMERO]' in paragraph.text:
            texto_reemplazo = f"{tipo_id}: {valor_id}"
            paragraph.text = paragraph.text.replace('[TIPO_Y_NUMERO]', texto_reemplazo)

    # Nota: docx también tiene tablas. Si tus plantillas usan tablas, 
    # habría que iterar sobre doc.tables además de doc.paragraphs.

    # 4. Guardar en memoria RAM en lugar de crear un archivo nuevo
    memoria = io.BytesIO()
    doc.save(memoria)
    memoria.seek(0) # Rebubinamos el archivo en memoria al principio
    
    return memoria