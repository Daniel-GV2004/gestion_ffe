from marshmallow import Schema, fields, validate, ValidationError, post_load
from core.config import db

class RepositorioSchema(Schema):
    docId = fields.String(
        required=True, 
        validate=validate.OneOf([
            "A6- Solicitud Excepcional",
            "Anexo I Modelo Acuerdo",
            "Anexo I.1 compensación beca",
            "Anexo II Plan formativo",
            "Anexo III Relación de alumnado",
            "Anexo IV Informe valorativo",
            "Anexo IX Solicitud Exención FFE",
            "Anexo V Solicitud inicio FFE-actualizado",
            "Anexo VII Solicitud Extraordinaria",
            "Anexo VIII Solicitud Modificación FFE",
            "Solicitud no realización"
        ])
    )
    
    tipo_identificador = fields.String(
        required=True, 
        validate=validate.OneOf(["nif", "cif"])
    )
    
    identificador = fields.Raw(required=True)

    @post_load
    def validar_y_buscar_en_bd(self, data, **kwargs):
        if db is None:
            raise ValidationError("Error interno: No hay conexión a la base de datos.")

        tipo_id = data['tipo_identificador'].lower()
        identificador = data['identificador']
        datos_bd = None

        # 1. LÓGICA SI ES UNA LISTA (Múltiples alumnos/empresas)
        if isinstance(identificador, list):
            if len(identificador) == 0:
                raise ValidationError("La lista de identificadores está vacía.")
            
            # Usamos $in para traer todos los que coincidan de golpe
            if tipo_id == 'nif':
                datos_bd = list(db.alumnos.find({"nif": {"$in": identificador}}))
            elif tipo_id == 'cif':
                datos_bd = list(db.empresas.find({"cif": {"$in": identificador}}))

            if not datos_bd or len(datos_bd) == 0:
                raise ValidationError("No se encontró ningún registro para las opciones seleccionadas.")

        # 2. LÓGICA SI ES UN STRING (Un solo alumno/empresa)
        else:
            if tipo_id == 'nif':
                datos_bd = db.alumnos.find_one({"nif": identificador})
            elif tipo_id == 'cif':
                datos_bd = db.empresas.find_one({"cif": identificador})

            if not datos_bd:
                raise ValidationError(f"No se encontró el {tipo_id.upper()}: {identificador}")

        # Inyectamos los datos reales extraídos
        data['datos_bd'] = datos_bd
        return data