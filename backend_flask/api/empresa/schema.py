from marshmallow import Schema, fields, EXCLUDE

class EmpresaSchema(Schema):
    # Definimos lo que esperamos. 
    # use_list=True permite que si faltan columnas en una fila, no explote.
    class Meta:
        # EXCLUDE hace que si hay columnas extra en el Excel que no definimos aquí, 
        # las ignore en lugar de dar error.
        unknown = EXCLUDE 

    # Ajusta estos nombres a lo que creas que tendrá el Excel
    CIF = fields.Str(data_key="CIF", allow_none=True)
    nombre_empresa = fields.Str(data_key="nombre_empresa", required=True)
    email = fields.Email(data_key="email", required=True)
    telefono = fields.Str(data_key="telefono", allow_none=True)
    nombre_contacto = fields.Str(data_key="nombre_contacto", allow_none=True)
    dirección = fields.Str(data_key="dirección", allow_none=True)
    nombre_tutor_empresa = fields.Str(data_key="nombre_tutor_empresa", allow_none=True)
    apellidos_tutor_empresa = fields.Str(data_key="apellidos_tutor_empresa", allow_none=True)
    email_tutor_empresa = fields.Str(data_key="email_tutor_empresa", allow_none=True)

# Instancias para uso externo
empresa_schema = EmpresaSchema()
empresa_schema = EmpresaSchema(many=True)