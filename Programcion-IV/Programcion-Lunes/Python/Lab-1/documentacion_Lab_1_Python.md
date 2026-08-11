# Explicación Detallada Línea por Línea - Laboratorio 1 (Python)

Este documento contiene una explicación línea por línea de todo el código desarrollado para el Laboratorio 1 de la asignatura **Programación IV**. El proyecto implementa una arquitectura multicapa en Python para interactuar con una base de datos PostgreSQL utilizando un pool de conexiones y el patrón de diseño DAO (Data Access Object).

---

## 1. Archivo: logger_base.py

Este módulo configura el sistema de registro de logs (`logging`) del proyecto para auditar la ejecución de la aplicación, guardando eventos en un archivo de texto y mostrándolos en la consola al mismo tiempo.

```python
import logging
```
* **Línea 1**: Importa el módulo nativo `logging` de Python, que provee herramientas para el seguimiento de eventos y depuración de software.

```python
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s: %(levelname)s [%(filename)s:%(lineno)s] %(message)s',
    datefmt='%I:%M:%S %p',
    handlers=[
        logging.FileHandler('capa_datos.log'),
        logging.StreamHandler()
    ]
)
```
* **Configuración del logger básico**: Llama a `logging.basicConfig()` para configurar los parámetros por defecto del logger del sistema.
* **`level=logging.DEBUG`**: Establece el nivel mínimo de los mensajes que serán registrados a `DEBUG` (mensajes de depuración fina). Esto significa que se registrarán todos los mensajes de nivel `DEBUG`, `INFO`, `WARNING`, `ERROR` y `CRITICAL`.
* **`format='...'`**: Define el formato de cada línea del log.
  * `%(asctime)s`: Muestra la fecha y hora del evento.
  * `%(levelname)s`: Indica la gravedad del evento (DEBUG, INFO, etc.).
  * `[%(filename)s:%(lineno)s]`: Muestra el nombre del archivo fuente y el número de línea donde ocurrió la llamada de log.
  * `%(message)s`: El cuerpo o descripción del mensaje de log.
* **`datefmt='%I:%M:%S %p'`**: Define el formato horario de `asctime` (12 horas, minutos, segundos y el indicador AM/PM).
* **`handlers=[...]`**: Lista de manejadores de salida para el log.
  * `logging.FileHandler('capa_datos.log')`: Guarda todos los registros de log de forma persistente en un archivo llamado `capa_datos.log`.
  * `logging.StreamHandler()`: Imprime los registros en la salida de consola estándar (`sys.stdout`).

```python
if __name__ == '__main__':
    logging.debug('Mensaje a nivel debug')
    logging.info('Mensaje a nivel info')
    logging.warning('Mensaje a nivel warning')
    logging.error('Mensaje a nivel error')
    logging.critical('Mensaje a nivel critical')
```
* **`if __name__ == '__main__':`**: Bloque condicional estándar de Python. Indica que el código interno solo se ejecutará si ejecutamos este archivo directamente (`python logger_base.py`), pero no si es importado desde otro módulo.
* **Pruebas de log**: Pruebas de funcionamiento para verificar que los logs se están emitiendo correctamente en todos los niveles de gravedad.

---

## 2. Archivo: Conexion.py

Este módulo gestiona la conexión a la base de datos de PostgreSQL mediante un Pool de Conexiones (`SimpleConnectionPool`), cargando las credenciales desde variables de entorno.

```python
import os
from dotenv import load_dotenv
from psycopg2 import pool  
from logger_base import logging
```
* Importa el módulo nativo `os` para leer variables del sistema.
* Importa `load_dotenv` de la librería externa `python-dotenv` para poder cargar variables definidas en un archivo `.env`.
* Importa `pool` desde `psycopg2` (el driver PostgreSQL oficial para Python) para poder crear y manejar un conjunto de conexiones reutilizables.
* Importa la variable configurada de `logging` desde el módulo local `logger_base.py`.

```python
# Carga las variables del archivo .env
load_dotenv()
```
* Busca un archivo `.env` en la raíz del proyecto y carga sus pares clave-valor como variables de entorno del sistema.

```python
class Conexion:
    DATABASE = os.getenv('DB_DATABASE')
    USERNAME = os.getenv('DB_USERNAME')
    PASSWORD = os.getenv('DB_PASSWORD')
    DB_PORT = os.getenv('DB_PORT')
    HOST = os.getenv('DB_HOST')
    MIN_CON = 1
    MAX_CON = 5
    pool = None
```
* Define la clase `Conexion` encargada de centralizar la interacción con PostgreSQL.
* Define atributos de clase que cargan las credenciales y configuración del servidor desde las variables de entorno (`DB_DATABASE`, `DB_USERNAME`, etc.).
* Atributos de clase que definen el número de conexiones iniciales mínimas (`MIN_CON` = 1) y máximas permitidas en el pool (`MAX_CON` = 5).
* Inicializa el pool de conexiones (`cls.pool`) en `None`. Se comportará como un Singleton (solo se creará un pool para toda la aplicación).

```python
    @classmethod
    def obtenerPool(cls):
        try:
            if cls.pool is None:
                cls.pool = pool.SimpleConnectionPool(
                    cls.MIN_CON,
                    cls.MAX_CON,
                    database=cls.DATABASE,
                    user=cls.USERNAME,
                    password=cls.PASSWORD,
                    port=cls.DB_PORT,
                    host=cls.HOST
                )
                logging.debug(f'Pool creado con éxito: {cls.pool}')
        except Exception as e:
            logging.error(f'Ocurrió un error al crear el pool de conexiones: {e}')
        return cls.pool
```
* Decorador `@classmethod` para que el método actúe sobre la clase (`cls`) y no sobre una instancia en particular.
* Define el método de clase `obtenerPool()`.
* Bloque `try` para capturar errores durante la inicialización del pool.
* Evalúa si el pool no ha sido creado (`cls.pool is None`).
* Instancia `SimpleConnectionPool` enviando los parámetros necesarios (mínimo, máximo, nombre de DB, usuario, contraseña, puerto y host).
* Loguea a nivel debug que el pool se creó exitosamente.
* Captura excepciones de inicialización y las registra con `logging.error()`.
* Retorna el pool (ya sea uno recién creado o el existente).

```python
    @classmethod
    def obtenerConexion(cls):
        try:
            conexion = cls.obtenerPool().getconn()
            return conexion
        except Exception as e:
            logging.error(f'Error al obtener la conexión del pool: {e}')
            return None
```
* Método para extraer una conexión libre desde el pool.
* Obtiene una conexión activa llamando a `cls.obtenerPool().getconn()`.
* Retorna el objeto conexión.
* Registra el error en logs y retorna `None` si la conexión falló.

```python
    @classmethod
    def liberarConexion(cls, conexion):
        try:
            if cls.pool is not None and conexion is not None:
                cls.pool.putconn(conexion)
                logging.debug(f'Conexión liberada correctamente: {conexion}')
        except Exception as e:
            logging.error(f'Error al liberar la conexión: {e}')
```
* Método de clase para devolver una conexión ya usada al pool.
* Verifica que el pool y la conexión no sean nulos.
* Usa `cls.pool.putconn(conexion)` para reintegrar la conexión al pool de recursos.
* Registra la liberación de la conexión.
* Atrapa excepciones del proceso de liberación.

```python
    @classmethod
    def cerrarConexiones(cls):
        try:
            if cls.pool is not None:
                cls.pool.closeall()
                logging.debug('Todas las conexiones del pool fueron cerradas.')
        except Exception as e:
            logging.error(f'Error al cerrar el pool de conexiones: {e}')
```
* Método de clase para cerrar todas las conexiones abiertas cuando termine el programa.
* Evalúa si el pool existe.
* Utiliza `cls.pool.closeall()` para cerrar físicamente todas las conexiones del pool abiertas hacia la base de datos.

---

## 3. Archivo: CursorDelPool.py

Este módulo implementa el protocolo de Context Manager (métodos mágicos `__enter__` y `__exit__`). Permite utilizar la estructura `with CursorDelPool() as cursor:` para asegurar la obtención de conexiones, ejecución de transacciones (automating commit/rollback) y cierre/liberación ordenada de recursos.

```python
from Conexion import Conexion
from logger_base import logging
```
* Importan la clase `Conexion` y el logger configurado.

```python
class CursorDelPool:
    def __init__(self):
        self._conexion = None
        self._cursor = None
```
* Define la clase `CursorDelPool`.
* Constructor de la clase.
* Declara e inicializa las propiedades privadas de instancia `_conexion` y `_cursor` en `None`.

```python
    def __enter__(self):
        logging.debug('Inicio del método __enter__ y obtención de cursor')
        self._conexion = Conexion.obtenerConexion()
        if self._conexion:
            self._cursor = self._conexion.cursor()
            return self._cursor
        else:
            raise Exception("No se pudo obtener una conexión de la base de datos.")
```
* Método mágico `__enter__` que se ejecuta automáticamente al iniciar la estructura de bloque `with`.
* Solicita una conexión libre al pool.
* Evalúa si la conexión fue exitosa.
* Si es exitosa, inicializa el cursor SQL de psycopg2 (`self._conexion.cursor()`).
* Retorna el cursor al bloque `with` (este valor se asignará a la variable después de `as`).
* Si falla la conexión, lanza una excepción para cortar el flujo de ejecución.

```python
    def __exit__(self, tipo_excepcion, valor_excepcion, detalle_excepcion):
        logging.debug('Se ejecuta el método __exit__')
        if tipo_excepcion:
            self._conexion.rollback()
            logging.error(f'Ocurrió una excepción, se hace rollback: {valor_excepcion}')
        else:
            self._conexion.commit()
            logging.debug('Transacción confirmada (commit)')
        
        if self._cursor:
            self._cursor.close()
        
        Conexion.liberarConexion(self._conexion)
```
* Método mágico `__exit__` que se ejecuta de forma garantizada al salir del bloque `with`, incluso si ocurrió un error dentro. Recibe los detalles de cualquier excepción no controlada.
* Evalúa si ocurrió alguna excepción dentro del bloque `with` (`tipo_excepcion` no es `None`).
* Si hubo un error, ejecuta un `rollback()` en la conexión para revertir cualquier cambio no guardado en la base de datos.
* Registra el error en logs.
* Si no hubo excepciones, ejecuta un `commit()` para confirmar los cambios.
* Si el cursor está inicializado, lo cierra para liberar recursos del lado del cliente y servidor.
* Devuelve la conexión activa de vuelta al pool para que pueda ser reusada.

---

## 4. Archivo: Usuario.py

Representa la clase modelo o entidad de dominio para los registros de la tabla `usuario`.

```python
class Usuario:
    def __init__(self, id_usuario=None, username=None, password=None):
        self._id_usuario = id_usuario
        self._username = username
        self._password = password
```
* Declara la clase `Usuario`.
* Constructor con parámetros opcionales inicializados por defecto en `None` (permite crear instancias sin ID, útiles para insertar nuevos registros).
* Define las variables encapsuladas (prefijo `_`) para la instancia: `_id_usuario`, `_username` y `_password`.

```python
    def __str__(self):
        return (f'Usuario [ID: {self._id_usuario}, '
                f'Username: {self._username}, '
                f'Password: {self._password}]')
```
* Sobrescribe el método mágico `__str__` para definir la representación en cadena del objeto.
* Formatea el retorno con los atributos del usuario, lo que resulta muy útil al momento de imprimir el objeto en consola con `print()`.

```python
    @property
    def id_usuario(self):
        return self._id_usuario

    @id_usuario.setter
    def id_usuario(self, id_usuario):
        self._id_usuario = id_usuario
```
* Decorador `@property` para definir el método getter de `id_usuario`.
* Decorador `@id_usuario.setter` para definir el método setter correspondiente.

```python
    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        self._username = username
```
* Implementan el Getter y Setter encapsulados del atributo `_username`.

```python
    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = password
```
* Implementan el Getter y Setter encapsulados del atributo `_password`.

---

## 5. Archivo: UsuarioDao.py

Implementa el patrón de diseño DAO (Data Access Object) para encapsular las sentencias SQL y todas las operaciones CRUD (Create, Read, Update, Delete) sobre la tabla de usuarios.

```python
from CursorDelPool import CursorDelPool
from Usuario import Usuario
from logger_base import logging
```
* Importa la clase `CursorDelPool` para el manejo de cursores, la entidad `Usuario` y el log.

```python
class UsuarioDao:
    SELECCIONAR = 'SELECT id_usuario, username, password FROM usuario ORDER BY id_usuario'
    INSERTAR = 'INSERT INTO usuario(username, password) VALUES(%s, %s)'
    ACTUALIZAR = 'UPDATE usuario SET username=%s, password=%s WHERE id_usuario=%s'
    ELIMINAR = 'DELETE FROM usuario WHERE id_usuario=%s'
```
* Declara la clase `UsuarioDao`.
* Define constantes de clase con las sentencias SQL preparadas que se ejecutarán en PostgreSQL. Usa `%s` como marcador de posición (placeholder) para evitar inyecciones SQL.

```python
    @classmethod
    def seleccionar(cls):
        usuarios = []
        try:
            with CursorDelPool() as cursor:
                cursor.execute(cls.SELECCIONAR)
                registros = cursor.fetchall()
                for registro in registros:
                    usuario = Usuario(registro[0], registro[1], registro[2])
                    usuarios.append(usuario)
        except Exception as e:
            logging.error(f'Error al seleccionar usuarios: {e}')
        return usuarios
```
* Define `seleccionar()` como un método de clase.
* Crea una lista vacía `usuarios` para almacenar los objetos resultantes.
* Abre un bloque `with` que solicita y gestiona de forma segura el cursor del pool a través de `CursorDelPool`.
* Ejecuta la consulta SQL de selección (`SELECCIONAR`).
* Recupera todas las tuplas/registros retornados con `fetchall()`.
* Itera por cada registro (tupla) mapeando sus valores para instanciar objetos `Usuario` e insertarlos a la lista `usuarios`.
* Atrapa y loguea posibles errores de consulta.
* Retorna la lista de usuarios.

```python
    @classmethod
    def insertar(cls, usuario):
        try:
            with CursorDelPool() as cursor:
                valores = (usuario.username, usuario.password)
                cursor.execute(cls.INSERTAR, valores)
                logging.debug(f'Usuario insertado: {usuario}')
                return cursor.rowcount
        except Exception as e:
            logging.error(f'Error al insertar usuario: {e}')
            return 0
```
* Define el método `insertar()`, que recibe un objeto `Usuario` como argumento.
* Inicia el contexto del cursor del pool.
* Prepara la tupla de valores a partir del objeto usuario.
* Ejecuta la inserción vinculando de forma segura los valores.
* Retorna el número de registros afectados (`rowcount`), útil para verificar el éxito de la operación.

```python
    @classmethod
    def actualizar(cls, usuario):
        try:
            with CursorDelPool() as cursor:
                valores = (usuario.username, usuario.password, usuario.id_usuario)
                cursor.execute(cls.ACTUALIZAR, valores)
                logging.debug(f'Usuario actualizado: {usuario}')
                return cursor.rowcount
        except Exception as e:
            logging.error(f'Error al actualizar usuario: {e}')
            return 0
```
* Método `actualizar()`, que recibe un objeto `Usuario` con valores nuevos y su ID a modificar.
* Obtiene un cursor, prepara y ejecuta la consulta de actualización enviando la tupla de valores en el orden esperado por la consulta SQL (`username`, `password`, `id_usuario`). Retorna los registros afectados.

```python
    @classmethod
    def eliminar(cls, usuario):
        try:
            with CursorDelPool() as cursor:
                valores = (usuario.id_usuario,)
                cursor.execute(cls.ELIMINAR, valores)
                logging.debug(f'Usuario eliminado: {usuario}')
                return cursor.rowcount
        except Exception as e:
            logging.error(f'Error al eliminar usuario: {e}')
            return 0
```
* Método `eliminar()`, que recibe un objeto `Usuario` (se requiere mínimo su `id_usuario`).
* Define la tupla de valores (la coma extra `(usuario.id_usuario,)` es necesaria en Python para indicar que es una tupla de un solo elemento).
* Ejecuta la sentencia DELETE y retorna los registros afectados.

---

## 6. Archivo: MenuAppUsuario.py

Contiene la interfaz de consola interactiva (Menú) para interactuar directamente con las operaciones CRUD de los usuarios.

```python
from logger_base import logging
from Conexion import Conexion
from Usuario import Usuario
from UsuarioDao import UsuarioDao
```
* Importan los componentes del proyecto necesarios para interactuar con la lógica de negocio y registrar logs.

```python
def iniciar_menu():
    opcion = None
    while opcion != 5:
        print("\n--- Menú Usuarios ---")
        print("1. Listar usuarios")
        print("2. Agregar usuario")
        print("3. Actualizar usuario")
        print("4. Eliminar usuario")
        print("5. Salir")
```
* Define la función principal `iniciar_menu()`.
* Declara la variable `opcion` inicializada en `None`.
* Bucle `while` que mantiene al menú ejecutándose de manera indefinida hasta que el usuario elija la opción de salida (5).
* Imprime por pantalla las opciones de las que dispone la aplicación.

```python
        try:
            opcion = int(input("Escribe tu opción (1-5): "))
```
* Bloque `try` para controlar ingresos inválidos del usuario que puedan colapsar el menú.
* Solicita al usuario ingresar un dato por teclado, lo convierte a entero con `int()` y lo almacena en `opcion`.

```python
            if opcion == 1:
                usuarios = UsuarioDao.seleccionar()
                for usuario in usuarios:
                    print(usuario)
```
* Si se selecciona `1` (Listar usuarios).
* Ejecuta `UsuarioDao.seleccionar()` y recorre la lista resultante imprimiendo cada objeto `Usuario` (llamando internamente a su método `__str__`).

```python
            elif opcion == 2:
                username_var = input("Escribe el username: ")
                password_var = input("Escribe el password: ")
                usuario = Usuario(username=username_var, password=password_var)
                UsuarioDao.insertar(usuario)
```
* Si se selecciona `2` (Agregar usuario).
* Captura las entradas para el nombre de usuario y contraseña.
* Crea una instancia del modelo `Usuario` enviando los atributos nombrados. Note que no se envía el ID porque la base de datos lo genera de forma automática.
* Envía la instancia a persistir a través de `UsuarioDao.insertar()`.

```python
            elif opcion == 3:
                id_var = int(input("Escribe el ID del usuario a modificar: "))
                username_var = input("Escribe el nuevo username: ")
                password_var = input("Escribe el nuevo password: ")
                usuario = Usuario(id_usuario=id_var, username=username_var, password=password_var)
                UsuarioDao.actualizar(usuario)
```
* Si se selecciona `3` (Actualizar usuario).
* Solicita el identificador entero del registro a modificar y sus nuevos datos correspondientes.
* Genera la instancia modelo asignando también el ID para identificar la fila de la base de datos a alterar.
* Llama al método `actualizar` del DAO.

```python
            elif opcion == 4:
                id_var = int(input("Escribe el ID del usuario a eliminar: "))
                usuario = Usuario(id_usuario=id_var)
                UsuarioDao.eliminar(usuario)
```
* Si se selecciona `4` (Eliminar usuario).
* Solicita el ID a eliminar.
* Crea una instancia del modelo asignando únicamente el ID.
* Invoca la eliminación del registro con el DAO.

```python
            elif opcion == 5:
                print("Saliendo del programa...")
```
* Si se selecciona `5` (Salir).
* Imprime el mensaje de despedida y el bucle `while` finalizará en la siguiente evaluación de condición.

```python
            else:
                print("Opción inválida. Ingrese un número entre 1 y 5.")
```
* Bloque `else` si ingresa un número fuera de rango.

```python
        except ValueError as ve:
            print(f"[Error de entrada]: Debe ingresar un valor numérico válido. Detalle: {ve}")
            logging.warning(f"Entrada inválida en el menú: {ve}")
```
* Excepción `ValueError` arrojada al intentar convertir una cadena de texto no numérica en entero (por ejemplo, al ingresar letras).
* Muestra una alerta amigable al usuario en la consola.
* Loguea el evento a nivel `warning` para el administrador del sistema.

```python
        except Exception as e:
            print(f"[Error inesperado]: Ha ocurrido un error en el sistema. Revise los logs.")
            logging.error(f"Error general en el menú principal: {e}")
```
* Excepción genérica para atrapar cualquier error no controlado previamente (como problemas de conexión persistente con la BD).
* Notifica al usuario de consola y guarda la traza en los archivos de log con severidad `ERROR`.

```python
if __name__ == '__main__':
    iniciar_menu()
```
* Comprobación del punto de entrada ejecutable.
* Inicia el menú principal de la consola de comandos.
