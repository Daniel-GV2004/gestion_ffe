# core/config.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DATABASE_NAME = "gestion_ffe"

try:
    # Creamos el cliente de conexión
    client = MongoClient(MONGO_URI)
    
    # Seleccionamos la base de datos
    db = client[DATABASE_NAME]
    
    client.server_info() 
    print(f"✅ Conexión exitosa a MongoDB: {DATABASE_NAME}")

except Exception as e:
    print(f"❌ Error al conectar a MongoDB: {e}")
    db = None