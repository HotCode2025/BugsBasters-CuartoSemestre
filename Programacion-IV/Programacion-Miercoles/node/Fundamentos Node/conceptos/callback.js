//function soyAsincrona(miCallback) {
    //setTimeout(function (miCallback) {
      //  console.log('Hola, soy una función asíncrona');
    //}, 1000);
//}

//console.log('Iniciando el proceso...');

//soyAsincrona(function () {
  //  console.log('Terminando el proceso...');
//});
function adios(nombre, otroCallback) {
    setTimeout(function() {
        console.log('Adios', nombre);
        otroCallback();
    }, 1000);
}
console.log('Iniciando el proceso...');

hola('Carlos', function() {
    adios('Carlos', function() {
        console.log('Terminando el proceso...');
    });
});
