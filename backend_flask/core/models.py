from __future__ import annotations

# from bson import ObjectId
# from deprecated import deprecated
# from mongoengine import *
# from mongoengine import signals
# from pymongo import UpdateOne

class Facturador():#DynamicDocument):
    # provincia = StringField(choices=[EMPTY_CHOICE, *PROVINCE_CHOICES])

    class FacturadorQuerySet():#MyQuerySet):
        def visible_by(self, user):
            if user.has_perms("dansaltech_project.crear_usuario_comercial"):
                return self.all()
            comercial = user._comercial
            if comercial:
                return self.filter(pk=comercial.facturador)
            return self.none()

    meta = {
        "collection": "datos_facturacion",
        "ordering": ("nombre", "nif"),
        "queryset_class": FacturadorQuerySet,
    }

