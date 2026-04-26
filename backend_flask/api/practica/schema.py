from marshmallow import Schema, fields, EXCLUDE, post_dump

class PracticaSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    id = fields.String(attribute="id", dump_only=True)
    alumno = fields.Str(required=True)
    empresa = fields.Str(required=True)
    
    fecha_inicio = fields.Date(required=True)
    fecha_fin = fields.Date(required=True)
    
    horas_totales = fields.Int()
    ciclo = fields.Str()
    curso = fields.Str()
    y_academico = fields.Str()

    @post_dump
    def representar_referencias(self, data, many, **kwargs):
        """
        Este método convierte los IDs en nombres legibles al enviar datos al Frontend.
        Solo funciona si los campos fueron 'dereferenced' en el query.
        """
        return data

practica_schema = PracticaSchema()
practicas_schema = PracticaSchema(many=True)