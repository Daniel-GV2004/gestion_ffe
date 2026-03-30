from marshmallow import Schema, fields, validate

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

    # El usuario debe decir si va a enviar un NIF o un CIF
    tipo_identificador = fields.String(
        required=True, 
        validate=validate.OneOf(["nif", "cif"])
    )
    
    # Aquí irá el número (ya sea el DNI del alumno o el CIF de la empresa)
    identificador = fields.String(required=True)