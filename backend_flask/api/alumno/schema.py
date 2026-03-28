from marshmallow import Schema, fields, EXCLUDE

class AlumnoSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    nif = fields.Str(required=True) 
    nombre = fields.Str(required=True)
    apellidos = fields.Str(required=True)
    email = fields.Email(required=True)
    telefono = fields.Str(allow_none=True)
    nuss = fields.Str(allow_none=True)

alumno_schema = AlumnoSchema()
alumnos_schema = AlumnoSchema(many=True)