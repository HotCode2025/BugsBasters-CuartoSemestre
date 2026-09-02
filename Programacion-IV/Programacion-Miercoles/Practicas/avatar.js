let personajeJugador = "";
let personajeEnemigo = "";

let vidasJugador = 3;
let vidasEnemigo = 3;

let ataqueJugador = "";
let ataqueEnemigo = "";


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

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

// Botones de ataques
const botonPunio = document.getElementById("boton-punio");
const botonPatada = document.getElementById("boton-patada");
const botonBarrida = document.getElementById("boton-barrida");

// Textos
const textoPersonajeJugador = document.getElementById("personaje-jugador");
const textoPersonajeEnemigo = document.getElementById("personaje-enemigo");

const textoVidasJugador = document.getElementById("vidas-jugador");
const textoVidasEnemigo = document.getElementById("vidas-enemigo");

const textoResultado = document.getElementById("resultado");
const contenedorHistorial = document.getElementById("historial-combate");


// ==========================================
// INICIO DEL JUEGO
// ==========================================

function iniciarJuego() {
    seccionInicio.style.display = "none";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "block";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";

    vidasJugador = 3;
    vidasEnemigo = 3;

    textoVidasJugador.innerText = vidasJugador;
    textoVidasEnemigo.innerText = vidasEnemigo;
}


// ==========================================
// MOSTRAR REGLAS Y NAVEGACIÓN
// ==========================================

function mostrarReglas() {
    seccionInicio.style.display = "none";
    seccionReglas.style.display = "block";
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
}

function volverInicio() {
    seccionInicio.style.display = "block";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
}


// ==========================================
// SELECCIONAR PERSONAJE
// ==========================================

function seleccionarPersonaje() {
    if (document.getElementById("zuko").checked) {
        personajeJugador = "Zuko";
    } else if (document.getElementById("katara").checked) {
        personajeJugador = "Katara";
    } else if (document.getElementById("aang").checked) {
        personajeJugador = "Aang";
    } else if (document.getElementById("toph").checked) {
        personajeJugador = "Toph";
    } else {
        alert("Debes seleccionar un personaje.");
        return;
    }

    textoPersonajeJugador.innerText = personajeJugador;

    seleccionarPersonajeEnemigo();
    textoPersonajeEnemigo.innerText = personajeEnemigo;

    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "block";
    seccionMensajes.style.display = "block";
    seccionReiniciar.style.display = "none";
}

function seleccionarPersonajeEnemigo() {
    const personajes = ["Zuko", "Katara", "Aang", "Toph"];
    const indiceAleatorio = Math.floor(Math.random() * personajes.length);
    personajeEnemigo = personajes[indiceAleatorio];
}


// ==========================================
// ATAQUES DEL JUGADOR Y ENEMIGO
// ==========================================

function elegirPunio() {
    ataqueJugador = "Puño ✊";
    jugarRonda();
}

function elegirPatada() {
    ataqueJugador = "Patada 🦵";
    jugarRonda();
}

function elegirBarrida() {
    ataqueJugador = "Barrida 👖";
    jugarRonda();
}

function seleccionarAtaqueEnemigo() {
    const ataques = ["Puño ✊", "Patada 🦵", "Barrida 👖"];
    const indiceAleatorio = Math.floor(Math.random() * ataques.length);
    ataqueEnemigo = ataques[indiceAleatorio];
}


// ==========================================
// COMBATE
// ==========================================

function jugarRonda() {
    seleccionarAtaqueEnemigo();

    let mensajeRonda = "";

    if (ataqueJugador === ataqueEnemigo) {
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador}. El enemigo atacó con ${ataqueEnemigo}. ¡EMPATE! 🤝`;
    } else if (
        (ataqueJugador === "Puño ✊" && ataqueEnemigo === "Barrida 👖") ||
        (ataqueJugador === "Patada 🦵" && ataqueEnemigo === "Puño ✊") ||
        (ataqueJugador === "Barrida 👖" && ataqueEnemigo === "Patada 🦵")
    ) {
        vidasEnemigo--;
        textoVidasEnemigo.innerText = vidasEnemigo;
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador}. El enemigo atacó con ${ataqueEnemigo}. ¡GANASTE ESTA RONDA! 🎉`;
    } else {
        vidasJugador--;
        textoVidasJugador.innerText = vidasJugador;
        mensajeRonda = `Tu personaje atacó con ${ataqueJugador}. El enemigo atacó con ${ataqueEnemigo}. ¡PERDISTE ESTA RONDA! 😢`;
    }

    mostrarMensaje(mensajeRonda);
    comprobarFinJuego();
}


// ==========================================
// MOSTRAR MENSAJES Y RESULTADOS
// ==========================================

function mostrarMensaje(mensaje) {
    if (textoResultado) {
        textoResultado.innerText = mensaje;
    }
}

function comprobarFinJuego() {
    if (vidasEnemigo <= 0) {
        mostrarMensaje("🎉 ¡GANASTE EL COMBATE! 🎉");
        terminarJuego();
    } else if (vidasJugador <= 0) {
        mostrarMensaje("😢 ¡PERDISTE EL COMBATE! 😢");
        terminarJuego();
    }
}

function terminarJuego() {
    botonPunio.disabled = true;
    botonPatada.disabled = true;
    botonBarrida.disabled = true;

    seccionReiniciar.style.display = "block";
}


// ==========================================
// REINICIAR
// ==========================================

function reiniciarJuego() {
    personajeJugador = "";
    personajeEnemigo = "";

    vidasJugador = 3;
    vidasEnemigo = 3;

    ataqueJugador = "";
    ataqueEnemigo = "";

    textoVidasJugador.innerText = vidasJugador;
    textoVidasEnemigo.innerText = vidasEnemigo;

    textoPersonajeJugador.innerText = "";
    textoPersonajeEnemigo.innerText = "";
    
    if (textoResultado) {
        textoResultado.innerText = "";
    }

    botonPunio.disabled = false;
    botonPatada.disabled = false;
    botonBarrida.disabled = false;

    // Desmarcar radio buttons
    const radios = document.querySelectorAll('input[name="personaje"]');
    radios.forEach(radio => radio.checked = false);

    seccionInicio.style.display = "block";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
}


// ==========================================
// EVENTOS Y ESTADO INICIAL
// ==========================================

window.addEventListener("load", () => {
    botonJugar.addEventListener("click", iniciarJuego);
    botonReglas.addEventListener("click", mostrarReglas);
    botonVolver.addEventListener("click", volverInicio);
    botonPersonaje.addEventListener("click", seleccionarPersonaje);

    botonPunio.addEventListener("click", elegirPunio);
    botonPatada.addEventListener("click", elegirPatada);
    botonBarrida.addEventListener("click", elegirBarrida);

    botonReiniciar.addEventListener("click", reiniciarJuego);

    seccionInicio.style.display = "block";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
});