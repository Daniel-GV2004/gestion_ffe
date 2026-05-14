from marshmallow import Schema, fields, EXCLUDE

class EmpresaSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    id = fields.String(attribute="id", dump_only=True)
    cif = fields.String(required=True)
    nombre_empresa = fields.String(required=True)
    email = fields.Email(required=True)
    telefono = fields.String(allow_none=True)
    nombre_contacto = fields.String(allow_none=True)
    direccion = fields.String(allow_none=True)
    numero_secuencia = fields.Integer(dump_only=True)
    codigo_acuerdo = fields.String(dump_only=True)
    cp = fields.Integer(required=True)
    
    nombre_tutor_empresa = fields.Str(allow_none=True)
    apellidos_tutor_empresa = fields.Str(allow_none=True)
    email_tutor_empresa = fields.Email(allow_none=True) 

empresa_schema = EmpresaSchema()
empresas_schema = EmpresaSchema(many=True)