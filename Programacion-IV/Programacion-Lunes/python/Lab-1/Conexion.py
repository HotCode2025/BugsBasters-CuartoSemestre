# Importa el módulo os para leer variables del sistema operativo
import os
# Importa load_dotenv para cargar variables desde el archivo de configuración .env
from dotenv import load_dotenv
# Importa pool de la biblioteca psycopg2 para implementar el pool de conexiones a PostgreSQL
from psycopg2 import pool  
# Importa el logger configurado desde logger_base para llevar un registro de eventos
from logger_base import logging

# Carga todas las variables de entorno definidas en el archivo .env ubicado en la raíz
load_dotenv()

# Define la clase Conexion que encapsulará la gestión de la base de datos
class Conexion:
    # Atributo de clase: Nombre de la base de datos obtenido de las variables de entorno
    DATABASE = os.getenv('DB_DATABASE')
    # Atributo de clase: Nombre de usuario de PostgreSQL obtenido de las variables de entorno
    USERNAME = os.getenv('DB_USERNAME')
    # Atributo de clase: Contraseña de la base de datos obtenida de las variables de entorno
    PASSWORD = os.getenv('DB_PASSWORD')
    # Atributo de clase: Puerto del servidor PostgreSQL obtenido de las variables de entorno
    DB_PORT = os.getenv('DB_PORT')
    # Atributo de clase: Dirección host del servidor obtenido de las variables de entorno
    HOST = os.getenv('DB_HOST')
    # Atributo de clase: Número mínimo de conexiones activas en el pool
    MIN_CON = 1
    # Atributo de clase: Número máximo de conexiones simultáneas en el pool
    MAX_CON = 5
    # Atributo de clase: Inicializa la variable que contendrá el pool de conexiones en None (patrón Singleton)
    pool = None

    # Método de clase para instanciar u obtener el pool de conexiones existente
    @classmethod
    def obtenerPool(cls):
        try:
            # Evalúa si el pool no ha sido creado todavía
            if cls.pool is None:
                # Instancia un SimpleConnectionPool usando los valores de configuración de la clase
                cls.pool = pool.SimpleConnectionPool(
                    cls.MIN_CON,
                    cls.MAX_CON,
                    database=cls.DATABASE,
                    user=cls.USERNAME,
                    password=cls.PASSWORD,
                    port=cls.DB_PORT,
                    host=cls.HOST
                )
                # Loguea en nivel debug que el pool fue creado exitosamente junto a su información
                logging.debug(f'Pool creado con éxito: {cls.pool}')
        # Captura cualquier excepción surgida al inicializar el pool
        except Exception as e:
            # Registra el error en los logs del sistema
            logging.error(f'Ocurrió un error al crear el pool de conexiones: {e}')
        # Retorna el objeto pool de conexiones de la clase
        return cls.pool

    # Método de clase para obtener una conexión del pool
    @classmethod
    def obtenerConexion(cls):
        try:
            # Extrae una conexión activa y disponible desde el pool llamando a getconn()
            conexion = cls.obtenerPool().getconn()
            # Retorna el objeto conexion obtenido
            return conexion
        # Captura errores en caso de no poder extraer una conexión
        except Exception as e:
            # Loguea el error detallado
            logging.error(f'Error al obtener la conexión del pool: {e}')
            # Retorna None indicando que falló la obtención
            return None

    # Método de clase para regresar una conexión usada al pool
    @classmethod
    def liberarConexion(cls, conexion):
        try:
            # Verifica que tanto el pool como la conexión que se quiere devolver no sean nulos
            if cls.pool is not None and conexion is not None:
                # Regresa la conexión al pool para ser reutilizada mediante putconn()
                cls.pool.putconn(conexion)
                # Loguea en nivel debug que la conexión se devolvió correctamente
                logging.debug(f'Conexión liberada correctamente: {conexion}')
        # Captura errores que puedan surgir en el proceso de liberación
        except Exception as e:
            # Registra el error surgido en logs
            logging.error(f'Error al liberar la conexión: {e}')

    # Método de clase para dar de baja y cerrar el pool completo
    @classmethod
    def cerrarConexiones(cls):
        try:
            # Verifica si el pool de conexiones está instanciado
            if cls.pool is not None:
                # Cierra físicamente todas las conexiones del pool hacia la base de datos
                cls.pool.closeall()
                # Loguea la confirmación del cierre de conexiones
                logging.debug('Todas las conexiones del pool fueron cerradas.')
        # Atrapa errores al cerrar el pool
        except Exception as e:
            # Registra la excepción en el archivo de log
            logging.error(f'Error al cerrar el pool de conexiones: {e}')