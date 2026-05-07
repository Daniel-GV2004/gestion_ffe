from mongoengine import Document, ReferenceField, DateTimeField, IntField, StringField, EmailField, ListField

from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(Document):
    nombre = StringField(required=True, unique=True, max_length=100)
    password = StringField(required=True)
    grados = ListField(StringField(), required=True)

    meta = {'collection': 'usuarios'}

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @classmethod
    def crear(cls, nombre, password, grados):
        nuevo_usuario = cls(nombre=nombre, grados=grados)
        nuevo_usuario.set_password(password)
        nuevo_usuario.save()
        return nuevo_usuario

    @classmethod
    def verificar(cls, nombre, password):
        user = cls.objects(nombre=nombre).first()
        if user and user.check_password(password):
            return user
        return None
    
class Agenda(Document):
    nombre = StringField(required=True)
    descripcion = StringField()
    fecha = DateTimeField(required=True)
    fecha_fin = DateTimeField()
    usuario = ReferenceField('Usuario', required=True)

    meta = {"collection": "agenda"}

class Alumno(Document):
    nombre = StringField(required=True, max_length=100)
    apellidos = StringField(required=True, max_length=150)
    nif = StringField(required=True, unique=True, max_length=9)
    email = EmailField(required=True, unique=True)
    telefono = StringField(max_length=20)
    nuss = StringField(max_length=12) 

    meta = {
        'collection': 'alumnos',
        'indexes': ['nif', 'email']
    }

    def nombre_completo(self):
        return f"{self.nombre} {self.apellidos}"

    @classmethod
    def buscar_por_nif(cls, nif_busqueda):
        return cls.objects(nif=nif_busqueda).first()
    
class Empresa(Document):
    nombre_empresa = StringField(required=True, max_length=200)
    cif = StringField(required=True, unique=True, max_length=15)
    email = EmailField(required=True)
    nombre_contacto = StringField(max_length=100)
    telefono = StringField(max_length=20)
    direccion = StringField(max_length=255)

    nombre_tutor_empresa = StringField(max_length=100)
    apellidos_tutor_empresa = StringField(max_length=150)
    email_tutor_empresa = EmailField()

    meta = {
        'collection': 'empresas',
        'indexes': ['cif', 'nombre_empresa']
    }

    def __str__(self):
        return f"{self.nombre_empresa} ({self.cif})"
    
class Practica(Document):
    alumno = ReferenceField('Alumno', required=True)
    empresa = ReferenceField('Empresa', required=True)
    
    fecha_inicio = DateTimeField(required=True)
    fecha_fin = DateTimeField(required=True)
    
    horas_totales = IntField(min_value=1)
    ciclo = StringField(required=True) 
    curso = StringField()
    y_academico = StringField()

    meta = {
        'collection': 'practicas',
        'ordering': ['-fecha_inicio']
    }

    def calcular_duracion_dias(self):
        """Calcula cuántos días dura la práctica."""
        if self.fecha_inicio and self.fecha_fin:
            delta = self.fecha_fin - self.fecha_inicio
            return delta.days
        return 0