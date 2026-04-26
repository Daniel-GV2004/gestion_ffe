from marshmallow import Schema, fields, EXCLUDE

class UsuarioSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.String(attribute="id", dump_only=True)
    nombre = fields.String(required=True)
    password = fields.String(required=True, load_only=True)
    grados = fields.List(fields.String(), required=True)

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)