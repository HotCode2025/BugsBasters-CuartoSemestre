# Importa el módulo nativo logging para gestionar la auditoría y depuración del sistema
import logging

# Configuración básica del sistema de logs
logging.basicConfig(
    # Define el nivel mínimo de los mensajes a registrar (DEBUG capturará todos los niveles)
    level=logging.DEBUG,
    # Define la estructura de cada línea del log: fecha/hora, severidad, [archivo:línea] y el mensaje de log
    format='%(asctime)s: %(levelname)s [%(filename)s:%(lineno)s] %(message)s',
    # Establece el formato de fecha y hora (ej: 04:30:15 PM)
    datefmt='%I:%M:%S %p',
    # Especifica los destinos de salida del log
    handlers=[
        # FileHandler guarda los mensajes de log de manera persistente en 'capa_datos.log'
        logging.FileHandler('capa_datos.log'),
        # StreamHandler imprime los mensajes en la consola de comandos estándar
        logging.StreamHandler()
    ]
)

# Verifica si este script se ejecuta directamente como programa principal
if __name__ == '__main__':
    # Mensaje de prueba de nivel de depuración detallada (DEBUG)
    logging.debug('Mensaje a nivel debug')
    # Mensaje de prueba de información de ejecución estándar (INFO)
    logging.info('Mensaje a nivel info')
    # Mensaje de prueba para advertencias sobre posibles problemas menores (WARNING)
    logging.warning('Mensaje a nivel warning')
    # Mensaje de prueba para registrar errores capturados o fallas controladas (ERROR)
    logging.error('Mensaje a nivel error')
    # Mensaje de prueba para advertir sobre fallas fatales que detienen el sistema (CRITICAL)
    logging.critical('Mensaje a nivel critical')