
// CLASES 
class Ataque {
    constructor(nombre, icono, venceA) {
        this.nombre = nombre;
        this.icono = icono;
        this.venceA = venceA; // Nombre del ataque al que vence
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

// INSTANCIACIÓN DE OBJETOS
// Creación de ataques estándar
const ATAQUE_PUNIO = new Ataque("Puño", "✊", "Barrida");
const ATAQUE_PATADA = new Ataque("Patada", "🦵", "Puño");
const ATAQUE_BARRIDA = new Ataque("Barrida", "👖", "Patada");

const listaAtaquesGlobales = [ATAQUE_PUNIO, ATAQUE_PATADA, ATAQUE_BARRIDA];

// Registro central de personajes (puedes agregar 10, 100 o 1000 aquí fácilmente)
const PERSONAJES_REGISTRADOS = [
    new Personaje("zuko", "Zuko", "../img/zuko.jpg", "Fuego"),
    new Personaje("katara", "Katara", "../img/katara.jpg", "Agua"),
    new Personaje("aang", "Aang", "../img/aang.jpg", "Aire"),
    new Personaje("toph", "Toph", "../img/toph.jpg", "Tierra")
];

// Asignar ataques a cada personaje instanciado
PERSONAJES_REGISTRADOS.forEach(personaje => {
    personaje.asignarAtaques(listaAtaquesGlobales);
});

// ESTADO Y ELEMENTOS DEL DOM
let jugador = null;
let enemigo = null;
let ataqueJugadorSeleccionado = null;

// Secciones
const seccionInicio = document.getElementById("inicio");
const seccionReglas = document.getElementById("reglas-del-juego");
const seccionPersonaje = document.getElementById("seleccionar-personaje");
const seccionAtaque = document.getElementById("seleccionar-ataque");
const seccionMensajes = document.getElementById("mensajes");
const seccionReiniciar = document.getElementById("reiniciar");

// Botones principales
const botonJugar = document.getElementById("boton-jugar");
const botonReglas = document.getElementById("boton-reglas");
const botonVolver = document.getElementById("boton-volver");
const botonPersonaje = document.getElementById("boton-personaje");
const botonReiniciar = document.getElementById("boton-reiniciar");

// Botones de ataque
const botonPunio = document.getElementById("boton-punio");
const botonPatada = document.getElementById("boton-patada");
const botonBarrida = document.getElementById("boton-barrida");

// Textos UI
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
    // Buscar cuál input fue marcado analizando el array de Objetos Personaje
    const personajeSeleccionado = PERSONAJES_REGISTRADOS.find(p => {
        const input = document.getElementById(p.id);
        return input && input.checked;
    });

    if (!personajeSeleccionado) {
        alert("Debes seleccionar un personaje.");
        return;
    }

    // Instanciar/Asignar los personajes seleccionados al estado actual
    jugador = personajeSeleccionado;
    jugador.reiniciarVidas();

    // Seleccionar enemigo aleatorio dentro del registro de personajes
    const indiceAleatorio = Math.floor(Math.random() * PERSONAJES_REGISTRADOS.length);
    enemigo = PERSONAJES_REGISTRADOS[indiceAleatorio];
    enemigo.reiniciarVidas();

    // Actualizar UI
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

    // Elección aleatoria de ataque del enemigo utilizando su propio array de ataques
    const indiceAtaqueEnemigo = Math.floor(Math.random() * enemigo.ataques.length);
    const ataqueEnemigoSeleccionado = enemigo.ataques[indiceAtaqueEnemigo];

    jugarRonda(ataqueJugadorSeleccionado, ataqueEnemigoSeleccionado);
}

function jugarRonda(ataqueJugador, ataqueEnemigo) {
    let mensajeRonda = "";

    if (ataqueJugador.nombre === ataqueEnemigo.nombre) {
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador.obtenerNombreCompleto()}. El enemigo atacó con ${ataqueEnemigo.obtenerNombreCompleto()}. ¡EMPATE! 🤝`;
    } else if (ataqueJugador.venceA === ataqueEnemigo.nombre) {
        enemigo.recibirDano();
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador.obtenerNombreCompleto()}. El enemigo atacó con ${ataqueEnemigo.obtenerNombreCompleto()}. ¡GANASTE ESTA RONDA! 🎉`;
    } else {
        jugador.recibirDano();
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador.obtenerNombreCompleto()}. El enemigo atacó con ${ataqueEnemigo.obtenerNombreCompleto()}. ¡PERDISTE ESTA RONDA! 😢`;
    }

    textoVidasJugador.innerText = jugador.vidas;
    textoVidasEnemigo.innerText = enemigo.vidas;
    textoResultado.innerText = mensajeRonda;

    comprobarFinJuego();
}

function comprobarFinJuego() {
    if (enemigo.vidas === 0) {
        textoResultado.innerText = "🎉 ¡GANASTE EL COMBATE! 🎉";
        terminarJuego();
    } else if (jugador.vidas === 0) {
        textoResultado.innerText = "😢 ¡PERDISTE EL COMBATE! 😢";
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

// 6. EVENTOS
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