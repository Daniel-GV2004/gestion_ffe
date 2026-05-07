from datetime import datetime

def calcular_curso():
    fecha = datetime.now()
    if not fecha:
        return None
    year = fecha.year
    # Si es Septiembre o posterior, el curso es Año/Año+1
    if fecha.month >= 9:
        return f"{year}/{year + 1}"
    # Si es antes de Septiembre, el curso es Año-1/Año
    else:
        return f"{year - 1}/{year}"