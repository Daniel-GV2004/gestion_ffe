import os
import io
import copy
from datetime import datetime
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import _Cell
from bson.errors import InvalidId
from .constants import (
    etiquetas_centro, 
    etiquetas_alumno, 
    etiquetas_empresa,
    etiquetas_usuario,
    etiquetas_practica
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLANTILLAS_DIR = os.path.join(BASE_DIR, 'plantillas_word')

def procesar_plantilla_word(doc, reemplazos_simples=None, reemplazos_tablas=None):
    def realizar_sustitucion_profunda(elemento_xml, mapeo):
        for p_xml in elemento_xml.xpath('.//w:p'):
            nodos_texto = [nodo for nodo in p_xml.iter() if nodo.tag.endswith('}t') and nodo.text]
            if not nodos_texto:
                continue
                
            texto_completo = "".join(n.text for n in nodos_texto)
            cambiado = False
            
            for etiqueta, valor in mapeo.items():
                if etiqueta in texto_completo:
                    texto_completo = texto_completo.replace(etiqueta, str(valor))
                    cambiado = True
            
            if cambiado:
                nodos_texto[0].text = texto_completo
                for n in nodos_texto[1:]:
                    n.text = ""

    # --- 1. TABLAS DINÁMICAS (Búsqueda XML Extrema) ---
    if reemplazos_tablas:
        for etiqueta_clave, lista_reemplazos in reemplazos_tablas.items():
            if not lista_reemplazos:
                continue
            
            tabla_obj_xml = None
            fila_molde_xml = None

            # En lugar de doc.tables, buscamos TODAS las tablas en el código fuente XML
            for tbl in doc._element.xpath('.//w:tbl'):
                for tr in tbl.xpath('.//w:tr'):
                    textos_celdas = []
                    for tc in tr.xpath('.//w:tc'):
                        texto_tc = "".join([n.text for n in tc.iter() if n.tag.endswith('}t') and n.text])
                        textos_celdas.append(texto_tc)
                        
                    if any(etiqueta_clave in t for t in textos_celdas):
                        tabla_obj_xml = tbl
                        fila_molde_xml = tr
                        break
                if tabla_obj_xml is not None: 
                    break
            
            # Si no ha encontrado la tabla o la fila, pasa de largo
            if tabla_obj_xml is None or fila_molde_xml is None:
                continue

            # Clona la fila y la inserta
            for _ in range(len(lista_reemplazos) - 1):
                nueva_fila = copy.deepcopy(fila_molde_xml)
                fila_molde_xml.addnext(nueva_fila)

            # Busca todas las filas recién creadas que tienen el ancla
            filas_finales = []
            for tr in tabla_obj_xml.xpath('.//w:tr'):
                textos_celdas = []
                for tc in tr.xpath('.//w:tc'):
                    texto_tc = "".join([n.text for n in tc.iter() if n.tag.endswith('}t') and n.text])
                    textos_celdas.append(texto_tc)
                if any(etiqueta_clave in t for t in textos_celdas):
                    filas_finales.append(tr)

            # Rellena los datos de los alumnos y borra el [!]
            for i, reemplazos_fila in enumerate(lista_reemplazos):
                if i < len(filas_finales):
                    realizar_sustitucion_profunda(filas_finales[i], reemplazos_fila)

    # --- 2. REEMPLAZOS SIMPLES GLOBALES ---
    if reemplazos_simples:
        realizar_sustitucion_profunda(doc._element, reemplazos_simples)

        for section in doc.sections:
            for hp in [section.header, section.footer, section.first_page_header, section.first_page_footer]:
                if hp and hasattr(hp, '_element'):
                    realizar_sustitucion_profunda(hp._element, reemplazos_simples)

    return doc

def generar_documento_en_memoria(datos_peticion, datos_completos_bd):
    from core.models import Empresa, Alumno, Practica 

    doc_id = datos_peticion.get('docId')
    ruta_plantilla = os.path.join(PLANTILLAS_DIR, f"{doc_id}.docx")
    
    if not os.path.exists(ruta_plantilla):
        raise FileNotFoundError(f"No se ha encontrado la plantilla: {doc_id}.docx")

    doc = Document(ruta_plantilla)

    reemplazos_simples = etiquetas_centro()
    
    usuario_data = datos_peticion.get('usuario', {})
    reemplazos_simples.update(etiquetas_usuario(usuario_data))

    reemplazos_tablas = {"[!]": []}

    def procesar_elemento(elemento):
        if not elemento: return

        if isinstance(elemento, str):
            documento_db = None
            try:
                documento_db = Empresa.objects(id=elemento).first()
                if not documento_db:
                    documento_db = Alumno.objects(id=elemento).first()
            except InvalidId: pass

            if not documento_db:
                documento_db = Empresa.objects(cif=elemento).first()
            if not documento_db:
                documento_db = Alumno.objects(nif=elemento).first()

            if documento_db:
                elemento = documento_db.to_mongo().to_dict()
                if "nif" in elemento:
                    practica_db = Practica.objects(alumno=documento_db.id).first()
                    if practica_db:
                        elemento["practica_asociada"] = practica_db.to_mongo().to_dict()

        if isinstance(elemento, dict):
            if "cif" in elemento or "nombre_empresa" in elemento:
                reemplazos_simples.update(etiquetas_empresa(elemento))
                
            if "nif" in elemento or "apellidos" in elemento:
                etiquetas_al = etiquetas_alumno(elemento)
                if "practica_asociada" in elemento:
                    etiquetas_al.update(etiquetas_practica(elemento["practica_asociada"]))
                
                reemplazos_simples.update(etiquetas_al)
                
                etiquetas_al_tabla = etiquetas_al.copy()
                etiquetas_al_tabla["[!]"] = "" 
                reemplazos_tablas["[!]"].append(etiquetas_al_tabla)

            if "empresa" in elemento: procesar_elemento(elemento["empresa"])
            if "alumno" in elemento: procesar_elemento(elemento["alumno"])
            if "alumnos" in elemento and isinstance(elemento["alumnos"], list):
                for al in elemento["alumnos"]: procesar_elemento(al)

    if isinstance(datos_completos_bd, list):
        for item in datos_completos_bd: procesar_elemento(item)
    elif isinstance(datos_completos_bd, dict):
        procesar_elemento(datos_completos_bd)

    if not reemplazos_tablas.get("[!]"):
        if "[!]" in reemplazos_tablas: del reemplazos_tablas["[!]"]

    doc = procesar_plantilla_word(doc, reemplazos_simples, reemplazos_tablas)

    memoria = io.BytesIO()
    doc.save(memoria)
    memoria.seek(0) 
    
    return memoria