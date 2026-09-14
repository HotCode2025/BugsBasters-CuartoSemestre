// CLASES 
class Ataque {
    constructor(nombre, icono, venceA) {
        this.nombre = nombre;
        this.icono = icono;
        this.venceA = venceA;
    }

    obtenerNombreCompleto() {
        return `${this.nombre} ${this.icono}`;
    }
}

class Personaje {
    constructor(id, nombre, foto, elemento) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.elemento = elemento;
        this.vidasMaximas = 3;
        this.vidas = 3;
        this.ataques = [];
    }

    asignarAtaques(listaAtaques) {
        this.ataques = listaAtaques;
    }

    recibirDano() {
        if (this.vidas > 0) {
            this.vidas--;
        }
    }

    reiniciarVidas() {
        this.vidas = this.vidasMaximas;
    }
}

// INSTANCIACIÓN DE OBJETOS Y ARRAYS
// Creación de ataques estándar
const ATAQUE_PUNIO = new Ataque("Puño", "✊", "Barrida");
const ATAQUE_PATADA = new Ataque("Patada", "🦵", "Puño");
const ATAQUE_BARRIDA = new Ataque("Barrida", "👖", "Patada");

const listaAtaquesGlobales = [ATAQUE_PUNIO, ATAQUE_PATADA, ATAQUE_BARRIDA];

// Arreglo vacío y uso de .push()
let avatares = [];

// Instanciamos los personajes individualmente
let zuko = new Personaje("zuko", "Zuko", "../img/zuko.jpg", "Fuego");
let katara = new Personaje("katara", "Katara", "../img/katara.jpg", "Agua");
let aang = new Personaje("aang", "Aang", "../img/aang.jpg", "Aire");
let toph = new Personaje("toph", "Toph", "../img/toph.jpg", "Tierra");

// Cargamos los objetos en el array
avatares.push(zuko, katara, aang, toph);

// Instancias nuevas
let sokka = new Personaje("sokka", "Sokka", "../img/sokka.jpg", "No Maestro");
let iroh = new Personaje("iroh", "Iroh", "../img/iroh.jpg", "Fuego");
let suki = new Personaje("suki", "Suki", "../img/suki.jpg", "Guerrera Kyoshi");

// Los empujas al array
avatares.push(sokka, iroh, suki);

// Verificamos en consola como pide la consigna
console.log(avatares);

// Asignar ataques a cada personaje dentro del array
avatares.forEach(personaje => {
    personaje.asignarAtaques(listaAtaquesGlobales);
});

// ESTADO Y ELEMENTOS DEL DOM
let jugador = null;
let enemigo = null;
let ataqueJugadorSeleccionado = null;

const seccionInicio = document.getElementById("inicio");
const seccionReglas = document.getElementById("reglas-del-juego");
const seccionPersonaje = document.getElementById("seleccionar-personaje");
const seccionAtaque = document.getElementById("seleccionar-ataque");
const seccionMensajes = document.getElementById("mensajes");
const seccionReiniciar = document.getElementById("reiniciar");

const botonJugar = document.getElementById("boton-jugar");
const botonReglas = document.getElementById("boton-reglas");
const botonVolver = document.getElementById("boton-volver");
const botonPersonaje = document.getElementById("boton-personaje");
const botonReiniciar = document.getElementById("boton-reiniciar");

const botonPunio = document.getElementById("boton-punio");
const botonPatada = document.getElementById("boton-patada");
const botonBarrida = document.getElementById("boton-barrida");

const textoPersonajeJugador = document.getElementById("personaje-jugador");
const textoPersonajeEnemigo = document.getElementById("personaje-enemigo");
const textoVidasJugador = document.getElementById("vidas-jugador");
const textoVidasEnemigo = document.getElementById("vidas-enemigo");
const textoResultado = document.getElementById("resultado");

// LÓGICA DE NAVEGACIÓN Y JUEGO
function iniciarJuego() {
    seccionInicio.style.display = "none";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "block";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
}

function mostrarReglas() {
    seccionInicio.style.display = "none";
    seccionReglas.style.display = "block";
}

function volverInicio() {
    seccionInicio.style.display = "block";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "none";
}

function seleccionarPersonaje() {
    // Buscamos en el nuevo array "avatares"
    const personajeSeleccionado = avatares.find(p => {
        const input = document.getElementById(p.id);
        return input && input.checked;
    });

    if (!personajeSeleccionado) {
        alert("Debes seleccionar un personaje.");
        return;
    }

    jugador = personajeSeleccionado;
    jugador.reiniciarVidas();

    // Seleccionamos un enemigo aleatorio del array "avatares"
    const indiceAleatorio = Math.floor(Math.random() * avatares.length);
    enemigo = avatares[indiceAleatorio];
    enemigo.reiniciarVidas();

    textoPersonajeJugador.innerText = jugador.nombre;
    textoPersonajeEnemigo.innerText = enemigo.nombre;
    textoVidasJugador.innerText = jugador.vidas;
    textoVidasEnemigo.innerText = enemigo.vidas;

    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "block";
    seccionMensajes.style.display = "block";
}


// COMBATE BASADO EN OBJETOS
function ejecutarAtaque(objetoAtaque) {
    ataqueJugadorSeleccionado = objetoAtaque;

    const indiceAtaqueEnemigo = Math.floor(Math.random() * enemigo.ataques.length);
    const ataqueEnemigoSeleccionado = enemigo.ataques[indiceAtaqueEnemigo];

    jugarRonda(ataqueJugadorSeleccionado, ataqueEnemigoSeleccionado);
}

function jugarRonda(ataqueJugador, ataqueEnemigo) {
    let mensajeRonda = "";

    if (ataqueJugador.nombre === ataqueEnemigo.nombre) {
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador.obtenerNombreCompleto()}. El enemigo atacó con ${ataqueEnemigo.obtenerNombreCompleto()}. ¡EMPATE! `;
    } else if (ataqueJugador.venceA === ataqueEnemigo.nombre) {
        enemigo.recibirDano();
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador.obtenerNombreCompleto()}. El enemigo atacó con ${ataqueEnemigo.obtenerNombreCompleto()}. ¡GANASTE ESTA RONDA! `;
    } else {
        jugador.recibirDano();
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador.obtenerNombreCompleto()}. El enemigo atacó con ${ataqueEnemigo.obtenerNombreCompleto()}. ¡PERDISTE ESTA RONDA! `;
    }

    textoVidasJugador.innerText = jugador.vidas;
    textoVidasEnemigo.innerText = enemigo.vidas;
    textoResultado.innerText = mensajeRonda;

    comprobarFinJuego();
}

function comprobarFinJuego() {
    if (enemigo.vidas === 0) {
        textoResultado.innerText = " ¡GANASTE EL COMBATE! ";
        terminarJuego();
    } else if (jugador.vidas === 0) {
        textoResultado.innerText = " ¡PERDISTE EL COMBATE! ";
        terminarJuego();
    }
}

function terminarJuego() {
    botonPunio.disabled = true;
    botonPatada.disabled = true;
    botonBarrida.disabled = true;
    seccionReiniciar.style.display = "block";
}

function reiniciarJuego() {
    jugador = null;
    enemigo = null;
    textoResultado.innerText = "";
    botonPunio.disabled = false;
    botonPatada.disabled = false;
    botonBarrida.disabled = false;

    const radios = document.querySelectorAll('#seleccionar-personaje input[type="radio"]');
    radios.forEach(radio => radio.checked = false);

    seccionInicio.style.display = "block";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
}

// EVENTOS
window.addEventListener("load", () => {
    botonJugar.addEventListener("click", iniciarJuego);
    botonReglas.addEventListener("click", mostrarReglas);
    botonVolver.addEventListener("click", volverInicio);
    botonPersonaje.addEventListener("click", seleccionarPersonaje);

    botonPunio.addEventListener("click", () => ejecutarAtaque(ATAQUE_PUNIO));
    botonPatada.addEventListener("click", () => ejecutarAtaque(ATAQUE_PATADA));
    botonBarrida.addEventListener("click", () => ejecutarAtaque(ATAQUE_BARRIDA));

    botonReiniciar.addEventListener("click", reiniciarJuego);

    seccionInicio.style.display = "block";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
});

// CONTROL DE VOLUMEN 
const reproductorMusica = document.getElementById("reproductor-musica");
const botonMute = document.getElementById("boton-mute");
const barraVolumen = document.getElementById("barra-volumen");

let volumenPrevio = 0.5;

if (reproductorMusica && barraVolumen) {
    // Establecer volumen inicial en 50%
    reproductorMusica.volume = 0.5;

    // Escuchar el movimiento de la barra de volumen
    barraVolumen.addEventListener("input", (e) => {
        const valor = parseFloat(e.target.value);
        reproductorMusica.volume = valor;

        // Si el usuario arrastra la barra manualmente, quitamos el mute si estaba en 0
        if (valor > 0) {
            reproductorMusica.muted = false;
        }
        
        actualizarIcono(valor);
    });

    // Escuchar clic en el botón Mute
    botonMute.addEventListener("click", () => {
        if (reproductorMusica.volume > 0) {
            volumenPrevio = reproductorMusica.volume;
            reproductorMusica.volume = 0;
            barraVolumen.value = 0;
            actualizarIcono(0);
        } else {
            reproductorMusica.volume = volumenPrevio || 0.5;
            barraVolumen.value = reproductorMusica.volume;
            actualizarIcono(reproductorMusica.volume);
        }
    });
}

function actualizarIcono(volumen) {
    if (volumen === 0) {
        botonMute.innerText = "🔇";
    } else if (volumen < 0.5) {
        botonMute.innerText = "🔉";
    } else {
        botonMute.innerText = "🔊";
    }
}