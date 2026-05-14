import os
import datetime

# --- FORMATEADORES DE DATOS ---
def formatearFechaFirma():
    meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    hoy = datetime.datetime.now()
    return f"En Valladolid, a {hoy.day} de {meses[hoy.month - 1]} de {hoy.year}"

def nombreCompleto(datos_persona):
    return f"{datos_persona.get('nombre', '')} {datos_persona.get('apellidos', '')}".strip()

def formatear_fecha(fecha):
    if not fecha:
        return ""
    if hasattr(fecha, 'strftime'):
        return fecha.strftime('%d/%m/%Y')
    if isinstance(fecha, str):
        try:
            parte_fecha = fecha.split('T')[0]
            fecha_obj = datetime.strptime(parte_fecha, '%Y-%m-%d')
            return fecha_obj.strftime('%d/%m/%Y')
        except ValueError:
            return fecha
    return str(fecha)

def etiquetas_practica(practica):
    if not practica:
        return {}
    
    return {
        "[HORAS]": practica.get("horas_totales", ""),
        "[F_INICIO]": formatear_fecha(practica.get("fecha_inicio", "")),
        "[F_FIN]": formatear_fecha(practica.get("fecha_fin", "")),
        "[CURSO]": practica.get("y_academico", ""),
        "[GRADO_PRACTICA]": practica.get("ciclo", ""),
        "[CURSO_PRACTICA]": practica.get("curso", "")
    }

def etiquetas_alumno(alumno):
    return {
        "[NOMBRE]": f"{alumno.get('nombre', '')} {alumno.get('apellidos', '')}".strip(),
        "[NIF]": alumno.get('nif', ''),
        "[EMAIL]": alumno.get('email', ''),
        "[TELEFONO]": alumno.get('telefono', ''),
        "[NUSS]": alumno.get('nuss', ''),
        "[GRUPO]": alumno.get('grupo', ''),
        "[DIRECCION]": alumno.get('direccion', ''),
        "[LOCALIDAD]": alumno.get('localidad', ''),
        "[PROVINCIA]": alumno.get('provincia', ''),
        "[CP]": alumno.get('cp', ''),
        "[CURSO]": alumno.get('curso', ''),
        "[GRADO]": alumno.get('grado', 'DAM')
    }

def etiquetas_centro():
    return {
        "[CENTRO_NOMBRE]": os.getenv("CENTRO_NOMBRE", "IES Ribera de Castilla"),
        "[CENTRO_CODIGO]": os.getenv("CENTRO_CODIGO", ""),
        "[CENTRO_NIF]": os.getenv("CENTRO_NIF", ""),
        "[CENTRO_LOCALIDAD]": os.getenv("CENTRO_LOCALIDAD", "Valladolid"),
        "[CENTRO_PROVINCIA]": os.getenv("CENTRO_PROVINCIA", "Valladolid"),
        "[CENTRO_DIRECCION]": os.getenv("CENTRO_DIRECCION", ""),
        "[CENTRO_CP]": os.getenv("CENTRO_CP", ""),
        "[CENTRO_TELEFONO]": os.getenv("CENTRO_TELEFONO", ""),
        "[CENTRO_EMAIL]": os.getenv("CENTRO_EMAIL", ""),
        "[DIRECTOR_NOMBRE]": os.getenv("DIRECTOR_NOMBRE", ""),
        "[DIRECTOR_NIF]": os.getenv("DIRECTOR_NIF", ""),
        "[LUGAR_FECHA]": formatearFechaFirma(),
        "[H_DEF]": "512"
    }

def etiquetas_empresa(empresa):
    return {
        "[EMP_NOMBRE]": empresa.get("nombre_empresa", ""),
        "[EMP_CIF]": empresa.get("cif", ""),
        "[EMP_EMAIL]": empresa.get("email", ""),
        "[EMP_TELEFONO]": empresa.get("telefono", ""),
        "[EMP_DIRECCION]": empresa.get("direccion", ""),
        "[EMP_LOCALIDAD]": "Valladolid",
        "[EMP_PROVINCIA]": "Valladolid",
        "[EMP_CP]": empresa.get("cp", ""),
        "[CODIGO_ACUERDO]": empresa.get("codigo_acuerdo", ""),
        "[REP_NOMBRE]": empresa.get("nombre_contacto", ""),
        "[TUTOR_NOMBRE]": f"{empresa.get('nombre_tutor_empresa', '')} {empresa.get('apellidos_tutor_empresa', '')}".strip(),
        "[TUTOR_EMAIL]": empresa.get("email_tutor_empresa", ""),
    }

def etiquetas_usuario(usuario):
    nombre = usuario.get('nombre', '')
    grado_actual = "DAM"
    
    mapa_codigos = codigo_grados()
    codigo_del_grado = mapa_codigos.get(grado_actual, "")
    
    return {
        "[NOMBRE_TUTOR]": nombre,
        "[GRADOS_TUTOR]": grado_actual,
        "[CODIGO_GRADO]": codigo_del_grado
    }

def codigo_grados():
    return {
        "DAM": "7777"
    }