from marshmallow import Schema, fields, EXCLUDE

class AlumnoSchema(Schema):
    # Definimos lo que esperamos. 
    # use_list=True permite que si faltan columnas en una fila, no explote.
    class Meta:
        # EXCLUDE hace que si hay columnas extra en el Excel que no definimos aquí, 
        # las ignore en lugar de dar error.
        unknown = EXCLUDE 

    # Ajusta estos nombres a lo que creas que tendrá el Excel
    NIF = fields.Str(data_key="NIF", allow_none=True)
    nombre = fields.Str(data_key="nombre", required=True)
    email = fields.Email(data_key="email", required=True)
    apellidos = fields.Str(data_key="apellidos", allow_none=True)
    telefono = fields.Str(data_key="telefono", allow_none=True)
    NUSS = fields.Str(data_key="NUSS", allow_none=True)
        

# Instancias para uso externo
alumno_schema = AlumnoSchema()
alumnos_schema = AlumnoSchema(many=True)