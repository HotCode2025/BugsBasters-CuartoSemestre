# Guía práctica de entornos virtuales en Python

## 1. Concepto de entorno virtual

Un entorno virtual (`venv`) es un espacio independiente asociado a un
proyecto de Python. En su interior se encuentra el intérprete o una
referencia a él, las herramientas de instalación de paquetes y el
directorio donde se guardan las bibliotecas instaladas.

La idea es mantener separadas las dependencias de cada aplicación,
evitando que las librerías de un proyecto interfieran con las de otro o
con las que utiliza el sistema operativo.

Ejemplo de organización:

``` text
Equipo
├── Python del sistema
│   └── site-packages/       # Paquetes instalados globalmente
├── aplicacion_web/
│   └── .venv/               # Dependencias propias de la aplicación web
└── analisis_datos/
    └── .venv/               # Dependencias propias del análisis
```

De esta forma, cada proyecto puede trabajar con las versiones de sus
bibliotecas que necesita.

------------------------------------------------------------------------

## 2. ¿Qué ventajas ofrece?

### Problemas de trabajar sin aislamiento

  -----------------------------------------------------------------------
  Situación                           Ejemplo
  ----------------------------------- -----------------------------------
  Diferencias entre versiones         Una aplicación necesita
                                      `requests==2.25` y otra requiere
                                      `requests==2.31`; una instalación
                                      global puede generar
                                      incompatibilidades.

  Dificultad para replicar el entorno Sin un registro de las
                                      dependencias, otra persona puede no
                                      saber qué paquetes instalar para
                                      ejecutar el proyecto.

  Acumulación de paquetes             Las instalaciones globales pueden
                                      dejar bibliotecas que ya no se
                                      utilizan y, en ciertos sistemas,
                                      afectar herramientas que dependen
                                      de Python.

  Permisos de instalación             La instalación global puede
                                      requerir permisos de administrador.
  -----------------------------------------------------------------------

### Beneficios de usar un entorno virtual

-   **Separación:** las bibliotecas y sus versiones se mantienen dentro
    del proyecto.
-   **Reproducción del entorno:** un archivo `requirements.txt` permite
    volver a instalar las dependencias.
-   **Mantenimiento sencillo:** si el entorno se daña, puede eliminarse
    y crearse de nuevo.
-   **Menos permisos:** los paquetes se instalan en la carpeta del
    proyecto, normalmente sin privilegios administrativos.
-   **Organización:** es una práctica habitual en proyectos de
    desarrollo.

El entorno reúne las dependencias necesarias para que la aplicación
resulte más fácil de mantener y ejecutar en distintos equipos.

------------------------------------------------------------------------

## 3. Archivos y directorios del entorno

Al crear un entorno virtual, Python genera una estructura similar a las
siguientes.

### Windows

``` text
.venv/
├── Include/
├── Lib/
│   └── site-packages/       # Bibliotecas instaladas
├── Scripts/
│   ├── activate             # Activación desde Git Bash
│   ├── activate.bat         # Activación desde CMD
│   ├── Activate.ps1         # Activación desde PowerShell
│   ├── python.exe
│   └── pip.exe
└── pyvenv.cfg               # Datos de configuración
```

### Linux y macOS

``` text
.venv/
├── bin/
│   ├── activate
│   ├── python -> python3
│   └── pip
├── include/
├── lib/
│   └── python3.X/
│       └── site-packages/
└── pyvenv.cfg
```

### ¿Qué cambia al activar el entorno?

La activación ajusta la variable `PATH` de la terminal para priorizar
las herramientas que están dentro del entorno. Por eso, al ejecutar
`python` o `pip`, se utilizan los programas de `.venv` en lugar de los
globales.

El archivo `pyvenv.cfg` registra información del Python base empleado.
Un ejemplo sería:

``` text
home = C:\Users\usuario\AppData\Local\Programs\Python\Python312
include-system-site-packages = false
version = 3.12.4
```

Cuando `include-system-site-packages` tiene el valor `false`, el entorno
no incorpora automáticamente los paquetes instalados globalmente.

------------------------------------------------------------------------

## 4. Antes de comenzar

Primero, verificá que Python esté disponible.

``` bash
# Windows
python --version
py --version

# Linux / macOS
python3 --version
```

En algunas instalaciones de Debian o Ubuntu puede ser necesario agregar
el módulo para crear entornos virtuales:

``` bash
sudo apt install python3-venv
```

------------------------------------------------------------------------

## 5. Crear el entorno del proyecto

Desde la terminal, ingresá a la carpeta del proyecto y ejecutá el
comando correspondiente.

``` bash
# Windows
python -m venv .venv

# Linux / macOS
python3 -m venv .venv
```

Significado de cada parte:

  -----------------------------------------------------------------------
  Elemento                            Función
  ----------------------------------- -----------------------------------
  `python`                            Selecciona el intérprete que se
                                      usará para crear el entorno y
                                      determina su versión.

  `-m venv`                           Ejecuta el módulo estándar de
                                      Python encargado de generar
                                      entornos virtuales.

  `.venv`                             Define el nombre de la carpeta que
                                      contendrá el entorno. También se
                                      utilizan nombres como `venv` o
                                      `env`.
  -----------------------------------------------------------------------

### Usar una versión determinada en Windows

Cuando hay varias versiones instaladas, se puede especificar cuál
utilizar:

``` bash
py -3.12 -m venv .venv
py -3.11 -m venv .venv
py --list
```

El último comando permite consultar las versiones disponibles mediante
el lanzador de Python.

------------------------------------------------------------------------

## 6. Activar, comprobar y desactivar

### Comandos de activación

  Sistema o terminal             Comando
  ------------------------------ ---------------------------------
  Windows --- CMD                `.venv\Scripts\activate.bat`
  Windows --- PowerShell         `.venv\Scripts\Activate.ps1`
  Windows --- Git Bash           `source .venv/Scripts/activate`
  Linux / macOS --- bash o zsh   `source .venv/bin/activate`

Al activarlo, normalmente se agrega `(.venv)` al comienzo de la línea de
la terminal.

``` text
(.venv) C:\proyectos\mi_app>
```

### Comprobar qué Python se está ejecutando

``` bash
# Windows
where python

# Linux / macOS
which python
```

La ruta indicada debería apuntar al entorno del proyecto. También se
puede comprobar desde un programa Python:

``` python
import sys

print(sys.prefix)       # Ubicación del entorno
print(sys.executable)   # Ejecutable que se está usando
```

Para salir del entorno activo:

``` bash
deactivate
```

### Borrar un entorno virtual

No existe un comando específico de `venv` para eliminarlo. Basta con
borrar su directorio, una vez que ya no se esté utilizando.

``` powershell
# Windows — PowerShell
Remove-Item -Recurse -Force .venv
```

``` bash
# Linux / macOS
rm -rf .venv
```

------------------------------------------------------------------------

## 7. Administrar paquetes con pip

Con el entorno activado, los paquetes se instalan y administran dentro
de él.

``` bash
# Actualizar pip
python -m pip install --upgrade pip

# Agregar un paquete
python -m pip install requests

# Instalar una versión concreta
python -m pip install requests==2.31.0

# Establecer un intervalo de versiones
python -m pip install "django>=5.0,<6.0"

# Instalar varias bibliotecas
python -m pip install pandas numpy matplotlib

# Consultar los paquetes instalados
python -m pip list

# Ver los datos de un paquete
python -m pip show requests

# Desinstalar un paquete
python -m pip uninstall requests
```

Es preferible ejecutar `python -m pip` en lugar de llamar directamente a
`pip`, porque así se utiliza el instalador asociado al intérprete
activo.

------------------------------------------------------------------------

## 8. Registrar dependencias en `requirements.txt`

El archivo `requirements.txt` enumera los paquetes que se deben instalar
para preparar el entorno del proyecto.

### Crear el archivo a partir de lo instalado

``` bash
python -m pip freeze > requirements.txt
```

`pip freeze` genera una lista de los paquetes y sus versiones
instaladas. Por ejemplo:

``` text
certifi==2024.7.4
charset-normalizer==3.3.2
idna==3.7
requests==2.32.3
urllib3==2.2.2
```

### Mantener una lista de dependencias directas

Como alternativa, se puede editar el archivo manualmente para incluir
solo las bibliotecas que el proyecto utiliza de forma directa:

``` text
# requirements.txt
requests>=2.31,<3.0
pandas==2.2.2
python-dotenv
```

### Operadores para indicar versiones

  Operador     Interpretación                    Ejemplo
  ------------ --------------------------------- --------------------------------
  `==`         Fija una versión                  `pandas==2.2.2`
  `>=`         Define una versión mínima         `requests>=2.31`
  `<` / `<=`   Establece un límite superior      `django<6.0`
  `~=`         Indica una versión compatible     `flask~=3.0` --- `>=3.0, <4.0`
  `!=`         Excluye una versión determinada   `numpy!=1.25.0`

### Separar herramientas de desarrollo

Las dependencias utilizadas solo durante el desarrollo ---por ejemplo,
pruebas y análisis de código--- pueden declararse en otro archivo:

``` text
# requirements-dev.txt
-r requirements.txt
pytest
black
ruff
```

Para instalarlas:

``` bash
python -m pip install -r requirements-dev.txt
```

------------------------------------------------------------------------

## 9. Preparar el proyecto en otra computadora

El objetivo es que otra persona pueda clonar el repositorio y
reconstruir el entorno con las dependencias declaradas.

``` bash
# 1. Descargar el repositorio
git clone https://github.com/usuario/mi_proyecto.git
cd mi_proyecto

# 2. Crear el entorno
python -m venv .venv

# 3. Activarlo
# Windows
source .venv/Scripts/activate

# Linux / macOS
source .venv/bin/activate

# 4. Instalar las dependencias
python -m pip install -r requirements.txt

# 5. Ejecutar la aplicación
python main.py
```

Elegí el comando de activación que corresponda al sistema operativo y a
la terminal que estés usando.

------------------------------------------------------------------------

## 10. Git y la carpeta `.venv`

La carpeta `.venv` no debe incorporarse al repositorio. Puede ocupar
mucho espacio, contiene referencias específicas del equipo donde fue
creada y depende del sistema operativo.

En cambio, conviene versionar `requirements.txt`, ya que permite
reconstruir las dependencias.

Ejemplo de archivo `.gitignore`:

``` gitignore
# Entornos virtuales
.venv/
venv/
env/

# Archivos temporales de Python
__pycache__/
*.pyc

# Configuración local con información sensible
.env
```

La idea central es guardar en Git la descripción de las dependencias, no
la carpeta del entorno ya generado.

------------------------------------------------------------------------

## 11. Configurar el entorno en Visual Studio Code

1.  Abrí en VS Code la carpeta principal del proyecto.
2.  Presioná `Ctrl + Shift + P`.
3.  Buscá y ejecutá **Python: Select Interpreter**.
4.  Seleccioná el intérprete ubicado en `.venv`.
5.  Abrí una terminal nueva. VS Code puede activar el entorno
    automáticamente si detecta la configuración.

Si hace falta, se puede definir el intérprete del proyecto en
`.vscode/settings.json`.

``` json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/Scripts/python.exe"
}
```

En Linux o macOS, la ruta habitual es:

``` json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python"
}
```

------------------------------------------------------------------------

## 12. Organización sugerida de archivos

Una estructura posible para un proyecto es la siguiente:

``` text
mi_proyecto/
├── .venv/                  # Entorno local, excluido de Git
├── src/
│   └── mi_proyecto/
│       ├── __init__.py
│       └── main.py
├── tests/
│   └── test_main.py
├── .env                    # Variables locales, excluidas de Git
├── .gitignore
├── requirements.txt        # Dependencias principales
├── requirements-dev.txt    # Dependencias para desarrollo
└── README.md
```

La estructura exacta puede adaptarse al tamaño y a las necesidades de
cada aplicación.

------------------------------------------------------------------------

## 13. Flujo de trabajo desde cero

Los siguientes comandos resumen una secuencia habitual para iniciar un
proyecto nuevo:

``` bash
# 1. Crear y abrir la carpeta
mkdir mi_proyecto
cd mi_proyecto

# 2. Generar el entorno
python -m venv .venv

# 3. Activarlo
# Windows — Git Bash
source .venv/Scripts/activate
# Linux / macOS
# source .venv/bin/activate

# 4. Actualizar pip
python -m pip install --upgrade pip

# 5. Instalar las dependencias iniciales
python -m pip install requests python-dotenv

# 6. Guardar las versiones instaladas
python -m pip freeze > requirements.txt

# 7. Excluir el entorno de Git
echo ".venv/" > .gitignore

# 8. Ejecutar el programa
python main.py

# 9. Si agregás otra biblioteca, actualizá el registro
python -m pip install pandas
python -m pip freeze > requirements.txt

# 10. Salir del entorno
deactivate
```

### Programa de ejemplo

``` python
import sys
import requests

print("Intérprete utilizado:", sys.executable)

response = requests.get("https://api.github.com")
print("Estado de la respuesta:", response.status_code)
```

El ejemplo muestra qué intérprete se está usando y realiza una solicitud
a la API de GitHub. Si `requests` no está instalado en el entorno
seleccionado, Python puede informar `ModuleNotFoundError`.

------------------------------------------------------------------------

## 14. Problemas habituales

### PowerShell no permite ejecutar scripts

Si aparece un aviso de que la ejecución de scripts está deshabilitada,
puede tratarse de la política de ejecución de PowerShell. Una opción es
activar el entorno desde CMD o Git Bash. También se puede evaluar, según
las políticas del equipo, esta configuración para el usuario actual:

``` powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

No cambies las políticas de un equipo administrado sin consultar antes
las reglas de tu organización.

### `ModuleNotFoundError: No module named 'xxx'`

Revisá lo siguiente:

-   Que el entorno virtual esté activo.
-   Que VS Code tenga seleccionado el intérprete de `.venv`.
-   Que el paquete se haya instalado dentro de ese entorno.

### Windows no reconoce el comando `python`

Puede que Python no esté agregado al `PATH` o que Windows esté
utilizando un alias de ejecución. Comprobá las instalaciones disponibles
con `py --list` y, si corresponde, usá el lanzador `py` o revisá la
configuración de instalación de Python.

### `externally-managed-environment` en Linux

Algunas distribuciones evitan las instalaciones globales con `pip` para
proteger los paquetes administrados por el sistema. Para un proyecto,
creá y activá un entorno virtual:

``` bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install paquete
```

### El entorno deja de funcionar tras mover la carpeta

Los entornos virtuales pueden contener rutas vinculadas a su ubicación
original. Si se mueve o renombra el proyecto y el entorno falla, lo más
práctico suele ser eliminar `.venv`, crearla otra vez e instalar las
dependencias desde el archivo de requisitos.

``` bash
rm -rf .venv
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

En Windows, borrá la carpeta con el Explorador o con el comando
apropiado para tu terminal.

------------------------------------------------------------------------

## 15. Otras herramientas para gestionar entornos y dependencias

`venv` es una opción incluida en Python y un buen punto de partida.
También existen otras herramientas que cubren necesidades adicionales.

  -----------------------------------------------------------------------
  Herramienta             Características         Usos habituales
  ----------------------- ----------------------- -----------------------
  **venv**                Incluido en Python y    Entornos virtuales
                          sencillo de utilizar.   generales.

  **virtualenv**          Ofrece funciones        Mantenimiento de
                          adicionales y           proyectos legacy.
                          compatibilidad con      
                          proyectos antiguos.     

  **pipenv**              Combina gestión de      Proyectos que utilizan
                          entornos y paquetes,    ese formato de bloqueo.
                          con `Pipfile` y         
                          `Pipfile.lock`.         

  **poetry**              Gestiona dependencias y Desarrollo y
                          empaquetado mediante    distribución de
                          `pyproject.toml`.       paquetes.

  **uv**                  Herramienta rápida para Flujos de trabajo que
                          gestionar Python,       priorizan velocidad.
                          entornos y paquetes.    

  **conda**               Administra entornos y   Ciencia de datos y
                          paquetes de Python y de aprendizaje automático.
                          otros ecosistemas.      
  -----------------------------------------------------------------------

Ejemplo de uso de `uv`:

``` bash
uv venv
uv pip install requests
uv pip freeze > requirements.txt
```

------------------------------------------------------------------------

## 16. Recomendaciones de uso

-   Crear un entorno virtual separado para cada proyecto.
-   Ubicarlo en la carpeta del proyecto y usar `.venv` como nombre
    habitual.
-   Incluir `.venv/` en `.gitignore` desde el inicio.
-   Mantener el archivo de dependencias actualizado cuando se agreguen o
    quiten paquetes.
-   Definir versiones de forma explícita cuando se necesite
    reproducibilidad.
-   Separar las herramientas de desarrollo de las dependencias
    principales si el proyecto lo requiere.
-   Preferir `python -m pip` para evitar instalar paquetes en otro
    intérprete.
-   Evitar instalar dependencias de proyectos en el Python global.
-   No editar manualmente los archivos internos de `.venv`.
-   No copiar entornos virtuales entre equipos: crear uno nuevo e
    instalar sus dependencias.

------------------------------------------------------------------------

## 17. Resumen de comandos

  -------------------------------------------------------------------------------------------------------------------
  Tarea                   Windows                                       Linux / macOS
  ----------------------- --------------------------------------------- ---------------------------------------------
  Crear entorno           `python -m venv .venv`                        `python3 -m venv .venv`

  Activar desde CMD       `.venv\Scripts\activate.bat`                  ---

  Activar desde           `.venv\Scripts\Activate.ps1`                  ---
  PowerShell                                                            

  Activar desde bash/zsh  `source .venv/Scripts/activate`               `source .venv/bin/activate`

  Desactivar              `deactivate`                                  `deactivate`

  Actualizar pip          `python -m pip install --upgrade pip`         `python -m pip install --upgrade pip`

  Instalar un paquete     `python -m pip install paquete`               `python -m pip install paquete`

  Mostrar paquetes        `python -m pip list`                          `python -m pip list`

  Exportar dependencias   `python -m pip freeze > requirements.txt`     `python -m pip freeze > requirements.txt`

  Instalar dependencias   `python -m pip install -r requirements.txt`   `python -m pip install -r requirements.txt`
  guardadas                                                             

  Ver intérprete          `where python`                                `which python`

  Eliminar entorno        `Remove-Item -Recurse -Force .venv`           `rm -rf .venv`
                          (PowerShell)                                  
  -------------------------------------------------------------------------------------------------------------------
