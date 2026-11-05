import requests

def get_razas():
    r = requests.get('https://dog.ceo/api/breeds/list')
    print(r.status_code)
    #print(r.text)
    print(type(r.text)) #vemos de que tipo es el texto, puede ser un string.
    #En este caso es: un String por el text, pero aqui
    #encontramos un diccionario con listas.
    razas = r.json()
    for raza in razas.values(): #utilizamos la funcion para los valores del diccionario
        print(f"Raza de los perritos: {raza}") #Estamos recorriendo los valores del diccionario