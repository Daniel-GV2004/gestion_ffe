from werkzeug.security import generate_password_hash, check_password_hash
from core.config import db  # Asegúrate de importar tu conexión desde config.py

class Usuario:
    @staticmethod
    def crear(nombre, password):
        hashed_password = generate_password_hash(password)
        db.usuarios.insert_one({
            "nombre": nombre,
            "password": hashed_password
        })

    @staticmethod
    def verificar(nombre, password):
        user = db.usuarios.find_one({"nombre": nombre})
        if user and check_password_hash(user['password'], password):
            return user
        return None