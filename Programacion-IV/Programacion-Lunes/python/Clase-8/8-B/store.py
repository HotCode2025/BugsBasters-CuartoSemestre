import requests

def get_razas():
    r = requests.get('https://dog.ceo/api/breeds/list')
    print(r.status_code)
    # print(r.text)
    print(type(r.text)) # Vemos de qué tipo es
    # En este caso es un string
    razas = r.json()
    for raza in razas.values(): #Utilizamos la función para los valores
        print(f"Raza de los perritos: {raza[5]}")