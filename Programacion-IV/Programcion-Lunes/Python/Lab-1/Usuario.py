# Define la clase de entidad Usuario que representa un registro de la base de datos
class Usuario:
    # Constructor de clase con valores por defecto inicializados en None para permitir flexibilidad
    def __init__(self, id_usuario=None, username=None, password=None):
        # Atributo encapsulado (privado) para almacenar el ID del usuario
        self._id_usuario = id_usuario
        # Atributo encapsulado (privado) para almacenar el nombre de usuario
        self._username = username
        # Atributo encapsulado (privado) para almacenar la contraseña del usuario
        self._password = password

    # Sobrescribe el método __str__ para definir la representación legible del objeto al imprimirlo
    def __str__(self):
        # Retorna una cadena formateada que detalla todos los atributos actuales de la instancia
        return (f'Usuario [ID: {self._id_usuario}, '
                f'Username: {self._username}, '
                f'Password: {self._password}]')

    # Getter para acceder al atributo encapsulado _id_usuario
    @property
    def id_usuario(self):
        # Retorna el ID actual del usuario
        return self._id_usuario

    # Setter para modificar de forma segura el atributo encapsulado _id_usuario
    @id_usuario.setter
    def id_usuario(self, id_usuario):
        # Asigna un nuevo valor a la propiedad privada _id_usuario
        self._id_usuario = id_usuario

    # Getter para acceder al atributo encapsulado _username
    @property
    def username(self):
        # Retorna el username actual del usuario
        return self._username

    # Setter para modificar de forma segura el atributo encapsulado _username
    @username.setter
    def username(self, username):
        # Asigna un nuevo valor al username privado
        self._username = username

    # Getter para acceder al atributo encapsulado _password
    @property
    def password(self):
        # Retorna la contraseña actual
        return self._password

    # Setter para modificar de forma segura el atributo encapsulado _password
    @password.setter
    def password(self, password):
        # Asigna una nueva contraseña al password privado
        self._password = password