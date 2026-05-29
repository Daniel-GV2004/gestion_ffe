# core/config.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/")
DATABASE_NAME = "gestion_ffe"

try:
    client = MongoClient(MONGO_URI)
    
    db = client[DATABASE_NAME]
    
    client.server_info() 

except Exception as e:
    print(f"Error al conectar a MongoDB: {e}")
    db = None

SECRET_KEY = "6df26d0cc6e2debe05809832a029ad8c80eab3b1da9d66d0af87881ce3369092"
ALGORITHM = "HS256"
SESSION_DURATION_HOURS = 2