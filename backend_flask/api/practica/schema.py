from marshmallow import Schema, fields, EXCLUDE

class PracticaSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    alumno = fields.Str(required=True)
    empresa = fields.Str(required=True)
    
    fecha_inicio = fields.Date(data_key="fecha inicio", required=True)
    fecha_fin = fields.Date(data_key="fecha fin", required=True)
    
    horas_totales = fields.Int(data_key="horas totales")
    ciclo = fields.Str(data_key="ciclo formativo")
    curso = fields.Str(data_key="curso")
    y_academico = fields.Str(data_key="año academico")

practica_schema = PracticaSchema()
practicas_schema = PracticaSchema(many=True)