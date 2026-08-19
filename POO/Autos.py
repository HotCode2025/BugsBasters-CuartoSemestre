# 1) definicion de la clase auto 

class Auto :
    def __init__(self, marca:str, color:str, año:int):
        #atributos de instancia
        self.marca = marca
        self.color = color
#2) Creacion de dos objetos (instancia)    
auto1=Auto("Ford", "rojo")
auto2=Auto("Toyota", "azul")

#3) Mostrar en pantalla la marca y el color de cada uno 
print(f"Auto 1: {auto1.marca}, {auto1.color}")
print(f"Auto 2: {auto2.marca}, {auto2.color}")
    