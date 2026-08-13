# Importa la clase Conexion para poder interactuar con el pool de conexiones
from Conexion import Conexion
# Importa el logging configurado para auditar la ejecución de las consultas
from logger_base import logging

# Define la clase CursorDelPool que funcionará como Context Manager (with)
class CursorDelPool:
    # Constructor de la clase
    def __init__(self):
        # Inicializa la conexión privada de la instancia en None
        self._conexion = None
        # Inicializa el cursor privado de la instancia en None
        self._cursor = None

    # Método mágico __enter__ que se ejecuta al iniciar la estructura 'with'
    def __enter__(self):
        # Registra el inicio del bloque del Context Manager
        logging.debug('Inicio del método __enter__ y obtención de cursor')
        # Solicita y asigna una conexión disponible desde la clase Conexion
        self._conexion = Conexion.obtenerConexion()
        # Verifica si se obtuvo una conexión válida
        if self._conexion:
            # Crea e inicializa el cursor asociado a esa conexión
            self._cursor = self._conexion.cursor()
            # Retorna el cursor al bloque 'with' (ej: 'with CursorDelPool() as cursor:')
            return self._cursor
        # Si no se pudo establecer la conexión, se lanza una excepción
        else:
            raise Exception("No se pudo obtener una conexión de la base de datos.")

    # Método mágico __exit__ que se ejecuta automáticamente al salir de la estructura 'with'
    # Recibe detalles de cualquier excepción ocurrida dentro del bloque (tipo, valor y traza)
    def __exit__(self, tipo_excepcion, valor_excepcion, detalle_excepcion):
        # Registra la ejecución del cierre de bloque y confirmación/descarte de la transacción
        logging.debug('Se ejecuta el método __exit__')
        # Si tipo_excepcion no es None, significa que ocurrió un error dentro del bloque 'with'
        if tipo_excepcion:
            # Hace un rollback para revertir y descartar cualquier cambio de la transacción fallida
            self._conexion.rollback()
            # Loguea el error ocurrido e informa del rollback
            logging.error(f'Ocurrió una excepción, se hace rollback: {valor_excepcion}')
        # Si no hubo errores durante la ejecución de las consultas SQL
        else:
            # Confirma y guarda los cambios de forma permanente en la base de datos (commit)
            self._conexion.commit()
            # Loguea que la transacción fue exitosa
            logging.debug('Transacción confirmada (commit)')
        
        # Si el cursor fue creado, procede a cerrarlo
        if self._cursor:
            # Cierra el cursor liberando sus recursos
            self._cursor.close()
        
        # Devuelve la conexión activa al pool para que pueda ser reusada
        Conexion.liberarConexion(self._conexion)