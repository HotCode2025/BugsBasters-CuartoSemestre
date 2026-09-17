#Bool contiene los valores de True y False
#Los tipos numericos es false para el 0, true para los demás valores
valor = 0
resultado = bool(valor)
print(f"El valor de {valor} es {resultado}")

valor = 0.1
resultado = bool(valor)
print(f"Valor: {valor}, Resultado: {resultado}")

#Tipo string -> false para cadena vacía, true para los demás valores
valor = ""
resultado = bool(valor)
print(f"Valor: '{valor}', Resultado: {resultado}")

valor = "Hola"
resultado = bool(valor)
print(f"Valor: '{valor}', Resultado: {resultado}")

#Tipo colecciones -> false para colecciones vacías
#Tipo colecciones -> true para todas las demás
#Lista
valor = []
resultado = bool(valor)
print(f"Valor de una lista vacía: {valor}, Resultado: {resultado}")

valor = [2, 3, 4]
resultado = bool(valor)
print(f"Valor de una lista con elementos: {valor}, Resultado: {resultado}")

#Tupla
valor = ()
resultado = bool(valor)
print(f"Valor de una tupla vacía: {valor}, Resultado: {resultado}")

valor = (5,)
resultado = bool(valor)
print(f"Valor de una tupla con elementos: {valor}, Resultado: {resultado}")

#Diccionario
valor = {}
resultado = bool(valor)
print(f"Valor de un diccionario vacío: {valor}, Resultado: {resultado}")

valor = {"nombre": "Juan", "edad": 30}
resultado = bool(valor)
print(f"Valor de un diccionario con elementos: {valor}, Resultado: {resultado}")

#Sentencia de contron con bool
if (1,):
    print("Regresa verdadero")
else:
    print("Regresa falso")


#Ciclos
variable = 17
while variable:
    print("Regresa verdadero")
else:
    print("Regresa falso")

#Profundizando en el tipo String
#Concatenación autimática en Python

variable = " Adios"
mensaje = "Hola" " Alumnos" + variable
mensaje += ", Terminamos"
#print (mensaje)

#Usamos la clase help para ayuda o domentación(built-in)
help(str)

help(str.capitalize)

help(math)

help(math.isnan)