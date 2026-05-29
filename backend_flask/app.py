import os
from dotenv import load_dotenv
from mongoengine import connect
from core.config import SECRET_KEY

from flask import Flask
from flask_cors import CORS
from api.usuario.bp import bp as usuario_bp
from api.alumno.bp import bp as alumno_bp
from api.empresa.bp import bp as empresa_bp
from api.practica.bp import bp as practica_bp
from api.repositorio.bp import bp as repositorio_bp
from api.agenda.bp import bp as agenda_bp
from api.auth.bp import bp as auth_bp

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = SECRET_KEY

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/gestion_ffe")
connect(host=MONGO_URI)

app.register_blueprint(usuario_bp, url_prefix='/api/usuario')
app.register_blueprint(alumno_bp, url_prefix='/api/alumno')
app.register_blueprint(empresa_bp, url_prefix='/api/empresa')
app.register_blueprint(practica_bp, url_prefix='/api/practica')
app.register_blueprint(repositorio_bp, url_prefix='/api/repositorio')
app.register_blueprint(agenda_bp, url_prefix='/api/agenda')
app.register_blueprint(auth_bp, url_prefix="/api/auth")