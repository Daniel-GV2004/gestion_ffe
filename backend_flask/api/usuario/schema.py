from marshmallow import Schema, fields, EXCLUDE

class UsuarioSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    nombre = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)