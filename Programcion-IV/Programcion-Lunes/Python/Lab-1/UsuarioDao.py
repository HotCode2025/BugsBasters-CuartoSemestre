# Importa la clase CursorDelPool para la obtención y liberación segura de cursores desde el pool
from CursorDelPool import CursorDelPool
# Importa la clase de entidad Usuario para mapear registros
from Usuario import Usuario
# Importa el sistema de logs configurado
from logger_base import logging

# Define la clase UsuarioDao (Data Access Object) para encapsular el acceso a datos
class UsuarioDao:
    # Sentencia SQL constante para seleccionar todos los usuarios ordenados por ID
    SELECCIONAR = 'SELECT id_usuario, username, password FROM usuario ORDER BY id_usuario'
    # Sentencia SQL constante para insertar un nuevo usuario (los comodines %s previenen SQL injection)
    INSERTAR = 'INSERT INTO usuario(username, password) VALUES(%s, %s)'
    # Sentencia SQL constante para actualizar un registro por su identificador único
    ACTUALIZAR = 'UPDATE usuario SET username=%s, password=%s WHERE id_usuario=%s'
    # Sentencia SQL constante para eliminar físicamente un registro por su ID
    ELIMINAR = 'DELETE FROM usuario WHERE id_usuario=%s'

    # Método de clase para seleccionar y listar todos los registros de usuario de la BD
    @classmethod
    def seleccionar(cls):
        # Lista vacía que almacenará las instancias de Usuario obtenidas
        usuarios = []
        try:
            # Utiliza la estructura 'with' con CursorDelPool para obtener y cerrar el cursor de forma segura
            with CursorDelPool() as cursor:
                # Ejecuta la consulta SQL de selección
                cursor.execute(cls.SELECCIONAR)
                # Recupera todas las tuplas de registros de la consulta
                registros = cursor.fetchall()
                # Itera a través de cada registro devuelto por PostgreSQL
                for registro in registros:
                    # Mapea los campos de la tupla (ID, username, password) para crear una instancia de Usuario
                    usuario = Usuario(registro[0], registro[1], registro[2])
                    # Añade el objeto Usuario instanciado a la lista
                    usuarios.append(usuario)
        # Captura errores que puedan suceder durante la consulta
        except Exception as e:
            # Registra la excepción detallada en el archivo de log
            logging.error(f'Error al seleccionar usuarios: {e}')
        # Retorna la lista con los usuarios (vacía si ocurrió un error)
        return usuarios

    # Método de clase para insertar un nuevo usuario en la base de datos
    @classmethod
    def insertar(cls, usuario):
        try:
            # Solicita un cursor del pool de forma segura a través del Context Manager
            with CursorDelPool() as cursor:
                # Genera una tupla con los valores del username y password del objeto modelo recibido
                valores = (usuario.username, usuario.password)
                # Ejecuta la sentencia SQL de inserción enlazando de forma segura la tupla de valores
                cursor.execute(cls.INSERTAR, valores)
                # Registra una entrada en logs con la información del usuario agregado
                logging.debug(f'Usuario insertado: {usuario}')
                # Retorna el conteo de filas afectadas por la consulta (debe ser 1 si fue exitoso)
                return cursor.rowcount
        # Captura errores surgidos en la transacción de inserción
        except Exception as e:
            # Registra el error en los logs
            logging.error(f'Error al insertar usuario: {e}')
            # Retorna 0 indicando que no se afectaron registros debido al error
            return 0

    # Método de clase para actualizar los datos de un usuario existente
    @classmethod
    def actualizar(cls, usuario):
        try:
            # Abre el bloque seguro con el cursor administrado
            with CursorDelPool() as cursor:
                # Prepara la tupla de valores respetando el orden del SQL: username, password, id_usuario
                valores = (usuario.username, usuario.password, usuario.id_usuario)
                # Ejecuta la sentencia de actualización vinculando los valores
                cursor.execute(cls.ACTUALIZAR, valores)
                # Registra los detalles del usuario actualizado
                logging.debug(f'Usuario actualizado: {usuario}')
                # Retorna las filas afectadas
                return cursor.rowcount
        # Atrapa excepciones de actualización
        except Exception as e:
            # Guarda la traza del error en logs
            logging.error(f'Error al actualizar usuario: {e}')
            # Retorna 0 como indicador de fallo
            return 0

    # Método de clase para eliminar un registro de usuario de la base de datos
    @classmethod
    def eliminar(cls, usuario):
        try:
            # Abre el contexto con el cursor del pool
            with CursorDelPool() as cursor:
                # Prepara la tupla de valores de forma explícita (la coma al final indica que es una tupla de 1 elemento)
                valores = (usuario.id_usuario,)
                # Ejecuta la sentencia SQL de eliminación
                cursor.execute(cls.ELIMINAR, valores)
                # Registra los detalles del usuario eliminado en los logs
                logging.debug(f'Usuario eliminado: {usuario}')
                # Retorna las filas afectadas
                return cursor.rowcount
        # Captura fallos del borrado
        except Exception as e:
            # Guarda el error en los logs
            logging.error(f'Error al eliminar usuario: {e}')
            # Retorna 0 para indicar que no se eliminó nada
            return 0