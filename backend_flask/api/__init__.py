from flask import Flask
from flask_marshmallow import Marshmallow

ma = Marshmallow()
    
def create_app():
    app = Flask(__name__)
    ma.init_app(app)

    # Registro de los Blueprints de cada carpeta
    from .alumnos.bp import alumnos_bp
    from .profesores.bp import profesores_bp
    from .empresas.bp import empresas_bp
    from .log.bp import log_bp

    app.register_blueprint(alumnos_bp)
    app.register_blueprint(profesores_bp)
    app.register_blueprint(empresas_bp)
    app.register_blueprint(log_bp)

    return app