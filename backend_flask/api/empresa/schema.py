from marshmallow import Schema, fields, EXCLUDE

class EmpresaSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    id = fields.Str(attribute="id")
    cif = fields.Str(required=True)
    nombre_empresa = fields.Str(required=True)
    email = fields.Email(required=True)
    telefono = fields.Str(allow_none=True)
    nombre_contacto = fields.Str(allow_none=True)
    direccion = fields.Str(allow_none=True)
    
    nombre_tutor_empresa = fields.Str(allow_none=True)
    apellidos_tutor_empresa = fields.Str(allow_none=True)
    email_tutor_empresa = fields.Email(allow_none=True) 

empresa_schema = EmpresaSchema()
empresas_schema = EmpresaSchema(many=True)