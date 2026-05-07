from marshmallow import Schema, fields, EXCLUDE

class AlumnoSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    id = fields.String(attribute="id", dump_only=True)
    nif = fields.Str(required=True) 
    nombre = fields.Str(required=True)
    apellidos = fields.Str(required=True)
    email = fields.Email(required=True)
    telefono = fields.Str(allow_none=True)
    nuss = fields.Str(allow_none=True)
    direccion = fields.String(allow_none=True)
    localidad = fields.String(allow_none=True)
    provincia = fields.String(allow_none=True)
    cp = fields.String(allow_none=True)
    curso = fields.String(dump_only=True)

alumno_schema = AlumnoSchema()
alumnos_schema = AlumnoSchema(many=True)