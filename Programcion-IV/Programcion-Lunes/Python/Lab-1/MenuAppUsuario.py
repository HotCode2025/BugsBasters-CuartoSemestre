# Importa el logging configurado para auditar accesos e ingresos erróneos en el menú
from logger_base import logging
# Importa Conexion para interactuar con la persistencia si fuera necesario
from Conexion import Conexion
# Importa el modelo de entidad Usuario
from Usuario import Usuario
# Importa el DAO de usuarios para realizar las operaciones CRUD correspondientes
from UsuarioDao import UsuarioDao

# Define la función principal para controlar el flujo del menú interactivo
def iniciar_menu():
    # Inicializa la variable de control de la opción elegida por el usuario
    opcion = None
    # Bucle interactivo que continuará repitiéndose mientras el usuario no ingrese la opción 5
    while opcion != 5:
        # Imprime la cabecera decorativa del menú
        print("\n--- Menú Usuarios ---")
        # Imprime la opción para mostrar el listado de usuarios
        print("1. Listar usuarios")
        # Imprime la opción para crear un nuevo usuario
        print("2. Agregar usuario")
        # Imprime la opción para editar un usuario existente por su ID
        print("3. Actualizar usuario")
        # Imprime la opción para eliminar un usuario por su ID
        print("4. Eliminar usuario")
        # Imprime la opción para detener la ejecución de la aplicación
        print("5. Salir")
        
        try:
            # Solicita un ingreso por consola, lo convierte a entero y lo guarda en opcion
            opcion = int(input("Escribe tu opción (1-5): "))
            
            # Evalúa si la opción seleccionada es 1 (Listado)
            if opcion == 1:
                # Recupera la lista completa de objetos Usuario desde la base de datos
                usuarios = UsuarioDao.seleccionar()
                # Itera la lista de usuarios obtenida
                for usuario in usuarios:
                    # Imprime cada usuario (llama implícitamente a su método __str__)
                    print(usuario)
            # Evalúa si la opción seleccionada es 2 (Insertar)
            elif opcion == 2:
                # Solicita al usuario ingresar el nuevo username por consola
                username_var = input("Escribe el username: ")
                # Solicita al usuario ingresar la contraseña correspondiente
                password_var = input("Escribe el password: ")
                # Instancia la entidad Usuario con los datos cargados por teclado (el ID queda en None)
                usuario = Usuario(username=username_var, password=password_var)
                # Envía la instancia del usuario a insertar a través del DAO
                UsuarioDao.insertar(usuario)
            # Evalúa si la opción seleccionada es 3 (Actualizar)
            elif opcion == 3:
                # Solicita e interpreta como entero el identificador del registro a modificar
                id_var = int(input("Escribe el ID del usuario a modificar: "))
                # Solicita el nuevo username
                username_var = input("Escribe el nuevo username: ")
                # Solicita el nuevo password
                password_var = input("Escribe el nuevo password: ")
                # Instancia Usuario con todos los atributos, incluyendo el ID de destino de actualización
                usuario = Usuario(id_usuario=id_var, username=username_var, password=password_var)
                # Invoca al DAO para efectuar la modificación en la base de datos
                UsuarioDao.actualizar(usuario)
            # Evalúa si la opción seleccionada es 4 (Eliminar)
            elif opcion == 4:
                # Solicita e interpreta como entero el ID del registro a remover
                id_var = int(input("Escribe el ID del usuario a eliminar: "))
                # Instancia Usuario configurando únicamente la propiedad id_usuario
                usuario = Usuario(id_usuario=id_var)
                # Envía el objeto instanciado al método eliminar del DAO
                UsuarioDao.eliminar(usuario)
            # Evalúa si la opción seleccionada es 5 (Salir)
            elif opcion == 5:
                # Muestra por consola el aviso de detención del sistema
                print("Saliendo del programa...")
            # Bloque para capturar ingresos numéricos fuera del rango esperado (1-5)
            else:
                print("Opción inválida. Ingrese un número entre 1 y 5.")
                
        # Captura errores en caso de que el usuario tipee texto en vez de números en el input
        except ValueError as ve:
            # Imprime un mensaje claro y amigable del error de tipeo en la consola
            print(f"[Error de entrada]: Debe ingresar un valor numérico válido. Detalle: {ve}")
            # Loguea en nivel WARNING que hubo un ingreso de datos inválido
            logging.warning(f"Entrada inválida en el menú: {ve}")
        # Captura cualquier otra excepción imprevista durante la ejecución del menú
        except Exception as e:
            # Muestra un aviso de error general en la interfaz de consola
            print(f"[Error inesperado]: Ha ocurrido un error en el sistema. Revise los logs.")
            # Registra la traza del error imprevisto en los logs del sistema
            logging.error(f"Error general en el menú principal: {e}")

# Comprobación de punto de ejecución principal del script
if __name__ == '__main__':
    # Inicia el ciclo interactivo del menú principal de usuarios
    iniciar_menu()