# api/usuario/schema.py
def usuario_schema(nombre, password):
    return {
        "nombre": nombre,
        "password": password, # Se guardará hasheada
        "fecha_creacion": None # Podrías añadir un timestamp aquí
    }