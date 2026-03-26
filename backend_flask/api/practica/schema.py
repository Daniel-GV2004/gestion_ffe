from marshmallow import Schema, fields, EXCLUDE

class PracticaSchema(Schema):
    # Definimos lo que esperamos. 
    # use_list=True permite que si faltan columnas en una fila, no explote.
    class Meta:
        # EXCLUDE hace que si hay columnas extra en el Excel que no definimos aquí, 
        # las ignore en lugar de dar error.
        unknown = EXCLUDE 

    alumno = fields.Str(data_key="alumno")
    empresa = fields.Str(data_key="empresa")
    fecha_inicio = fields.Date(data_key="fecha inicio")
    fecha_fin = fields.Date(data_key="fecha fin")
    horas_totales = fields.Integer(data_key="horas totales")
    ciclo = fields.Str(data_key="ciclo formativo")
    curso = fields.Str(data_key="curso academico")
    y_academico = fields.Str(data_key="año academico")

# Instancias para uso externo
practica_schema = PracticaSchema()
practica_schema = PracticaSchema(many=True)