from flask import Flask
from flask_cors import CORS
from api.usuario.bp import usuario_bp
from api.alumno.bp import alumno_bp
from api.empresa.bp import empresa_bp
from api.practica.bp import practica_bp

app = Flask(__name__)
CORS(app) # Importante para que tu React de Vite no de error de CORS

app.register_blueprint(usuario_bp, url_prefix='/usuario')
app.register_blueprint(alumno_bp, url_prefix='/api/alumno')
app.register_blueprint(empresa_bp, url_prefix='/api/empresa')
app.register_blueprint(practica_bp, url_prefix='/api/practica')

if __name__ == '__main__':
    app.run(debug=True, port=5000)