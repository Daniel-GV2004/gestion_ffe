from marshmallow import Schema, fields, EXCLUDE

class AgendaSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    id = fields.String(attribute="id", dump_only=True)
    nombre = fields.String(required=True) 
    descripcion = fields.String(allow_none=True)
    fecha = fields.DateTime(required=True)
    fecha_fin = fields.DateTime(allow_none=True)
    usuario = fields.String(required=True)

agenda_schema = AgendaSchema()
agendas_schema = AgendaSchema(many=True)