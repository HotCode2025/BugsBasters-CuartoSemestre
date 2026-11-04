JavaScript
function hola(nombre, miCallback) {
    setTimeout(function () {
        console.log('Hola, ' + nombre);
        miCallback(nombre);
    }, 1000);
}

function hablar(callbackHablar) {
    setTimeout(function () {
        console.log('bla bla bla bla');
        callbackHablar();
    }, 1000);
}

function adios(nombre, otroCallback) {
    setTimeout(function () {
        console.log('Adios', nombre);
        otroCallback();
    }, 1000);
}

// Recursive function tapno maul-ulit ti "hablar" a saan a mangaramid ti callback hell
function conversacion(nombre, veces, callback) {
    if (veces > 0) {
        hablar(function () {
            conversacion(nombre, --veces, callback);
        });
    } else {
        adios(nombre, callback);
    }
}

// -- Proceso principal
console.log('Iniciando el proceso...');

hola('Ariel', function (nombre) {
    conversacion(nombre, 3, function () {
        console.log('Terminando el proceso...');
    });
});