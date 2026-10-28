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
    constructor(id, nombre, foto, elemento, fotoMapa) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.elemento = elemento;

        this.fotoMapa = fotoMapa; // Imagen de cuerpo completo

        // Vidas del personaje
        this.vidasMaximas = 3;
        this.vidas = 3;

        // Ataques del personaje
        this.ataques = [];

        // Posición y tamaño en el mapa
        this.x = 20;
        this.y = 30;
        this.ancho = 80;
        this.alto = 80;

        // Velocidad de movimiento
        this.velocidadX = 0;
        this.velocidadY = 0;

        this.mapaFoto = new Image();

        if (fotoMapa) {
            this.mapaFoto.src = fotoMapa;
        }
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

// INSTANCIACIÓN DE OBJETOS Y ARRAYS´
// Creación de ataques estándar
const ATAQUE_PUNIO = new Ataque("Puño", "✊", "Barrida");
const ATAQUE_PATADA = new Ataque("Patada", "🦵", "Puño");
const ATAQUE_BARRIDA = new Ataque("Barrida", "👖", "Patada");

const listaAtaquesGlobales = [ATAQUE_PUNIO, ATAQUE_PATADA, ATAQUE_BARRIDA];

// Arreglo vacío y uso de .push()
let avatares = [];

// Instanciamos los personajes individualmente
let zuko = new Personaje("zuko", "Zuko", "../img/zuko.jpg", "Fuego", "/Programacion-IV/Programacion-Miercoles/Practicas/img/zuko-mapa.webp");
let katara = new Personaje("katara", "Katara", "../img/katara.jpg", "Agua", "/Programacion-IV/Programacion-Miercoles/Practicas/img/katara-mapa.png");
let aang = new Personaje("aang", "Aang", "../img/aang.jpg", "Aire", "/Programacion-IV/Programacion-Miercoles/Practicas/img/aang-mapa.webp");
let toph = new Personaje("toph", "Toph", "../img/toph.jpg", "Tierra", "/Programacion-IV/Programacion-Miercoles/Practicas/img/toph-mapa.png");

// Cargamos los objetos en el array
avatares.push(zuko, katara, aang, toph);

// Instancias nuevas
let sokka = new Personaje("sokka", "Sokka", "../img/sokka.jpg", "No Maestro", "/Programacion-IV/Programacion-Miercoles/Practicas/img/sokka-mapa.png");
let iroh = new Personaje("iroh", "Iroh", "../img/iroh.jpg", "Fuego", "/Programacion-IV/Programacion-Miercoles/Practicas/img/iroh-mapa.png");
let suki = new Personaje("suki", "Suki", "../img/suki.jpg", "Guerrera Kyoshi", "/Programacion-IV/Programacion-Miercoles/Practicas/img/suki-mapa.webp");

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

const avisoEncuentro = document.getElementById("aviso-encuentro");
const botonCombatir = document.getElementById("boton-combatir");


const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

// Contexto para dibujar en dos dimensiones
const lienzo = mapa.getContext("2d");
const mapaBackground = new Image();

mapaBackground.src =
    "/Programacion-IV/Programacion-Miercoles/Practicas/img/fotoMapa1.jpg";
    mapaBackground.onload = () => {
    dibujarMapa();
};

mapaBackground.onerror = () => {
    console.error(
        "No se pudo cargar el fondo:",
        mapaBackground.src
    );
};

// Datos del personaje que se mueve por el mapa
let imagenJugadorMapa = new Image();

let posicionJugador = {
    x: 20,
    y: 20
};
let posicionEnemigo = {
    x: 0,
    y: 0,
    direccion: 1
};

const velocidadEnemigo = 2;

let encuentroActivo = false;
const distanciaEncuentro = 100;
let intervaloMovimiento = null;
let intervaloMovimientoEnemigo = null;
let intervaloEncuentro = null;


const anchoJugador = 100;
const altoJugador = 130;
const velocidadJugador = 4;

let teclasPresionadas = {
    arriba: false,
    abajo: false,
    izquierda: false,
    derecha: false
};

// LÓGICA DE NAVEGACIÓN Y JUEGO
function iniciarJuego() {
    sectionVerMapa.style.display = "none";
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
    // Buscamos el personaje seleccionado
    const personajeSeleccionado = avatares.find(p => {
        const input = document.getElementById(p.id);
        return input && input.checked;
    });

    if (!personajeSeleccionado) {
        alert("Debes seleccionar un personaje.");
        return;
    }

    // Creamos una instancia independiente para el jugador
    jugador = new Personaje(
    personajeSeleccionado.id,
    personajeSeleccionado.nombre,
    personajeSeleccionado.foto,
    personajeSeleccionado.elemento,
    personajeSeleccionado.fotoMapa
    );
    
    jugador.asignarAtaques(listaAtaquesGlobales);

    const avataresDisponibles = avatares.filter(
    personaje => personaje.id !== jugador.id
);

const indiceAleatorio = Math.floor(
    Math.random() * avataresDisponibles.length
);

const personajeEnemigo = avataresDisponibles[indiceAleatorio];

    // Creamos una instancia independiente para el enemigo
    enemigo = new Personaje(
    personajeEnemigo.id,
    personajeEnemigo.nombre,
    personajeEnemigo.foto,
    personajeEnemigo.elemento,
    personajeEnemigo.fotoMapa
    );

    enemigo.asignarAtaques(listaAtaquesGlobales);

    // Mostramos los personajes y sus vidas iniciales
    textoPersonajeJugador.innerText = jugador.nombre;
    textoPersonajeEnemigo.innerText = enemigo.nombre;
    textoVidasJugador.innerText = jugador.vidas;
    textoVidasEnemigo.innerText = enemigo.vidas;

    // Mostramos la sección de combate
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";

    sectionVerMapa.style.display = "flex";

    cargarImagenJugador();
}

function continuarAlCombate() {
    sectionVerMapa.style.display = "none";
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
    sectionVerMapa.style.display = "none";

    avisoEncuentro.style.display = "none";
    encuentroActivo = false;
}

function cargarImagenJugador() {
    teclasPresionadas.arriba = false;
    teclasPresionadas.abajo = false;
    teclasPresionadas.izquierda = false;
    teclasPresionadas.derecha = false;
    // Posición inicial: 
    //jugador
    posicionJugador.x = (mapa.width - anchoJugador) / 2;
    posicionJugador.y = mapa.height - altoJugador - 20;

    //enemigo
    posicionEnemigo.x = mapa.width - anchoJugador - 20;
    posicionEnemigo.y = 30;

    // Usamos la imagen del personaje que eligió el jugador
    if (!jugador || !jugador.mapaFoto) {
        console.error("El personaje seleccionado no tiene imagen de mapa.");
        return;
    }

    const imagen = jugador.mapaFoto;

    if (imagen.complete && imagen.naturalWidth > 0) {
        dibujarMapa();
    } else {
        imagen.onload = () => dibujarMapa();

        imagen.onerror = () => {
            console.error("No se pudo cargar la imagen:", imagen.src);
        };
    }
}

function dibujarMapa() {
    // Limpiamos el canvas
    lienzo.clearRect(0, 0, mapa.width, mapa.height);

    function dibujarSombra(x, y, ancho) {
    lienzo.save();

    lienzo.fillStyle = "rgba(0, 0, 0, 0.25)";
    lienzo.beginPath();
    lienzo.ellipse(
        x + ancho / 2,
        y + altoJugador - 3,
        ancho * 0.3,
        6,
        0,
        0,
        Math.PI * 2
    );
    lienzo.fill();

    lienzo.restore();
}

    // Dibujamos el fondo cuando esté cargado
    if (
        mapaBackground.complete &&
        mapaBackground.naturalWidth > 0
    ) {
        lienzo.drawImage(
            mapaBackground,
            0,
            0,
            mapa.width,
            mapa.height
        );
    }
    dibujarSombra(posicionJugador.x, posicionJugador.y, anchoJugador);
    // Dibujamos al jugador
    if (jugador?.mapaFoto?.complete && jugador.mapaFoto.naturalWidth > 0) {
    lienzo.drawImage(
        jugador.mapaFoto,
        posicionJugador.x,
        posicionJugador.y,
        anchoJugador,
        altoJugador
    );
}
    dibujarSombra(posicionEnemigo.x, posicionEnemigo.y, anchoJugador);
    // Dibujamos al enemigo
    if (enemigo && enemigo.mapaFoto.complete && enemigo.mapaFoto.naturalWidth > 0) {
    lienzo.drawImage(
        enemigo.mapaFoto,
        posicionEnemigo.x,
        posicionEnemigo.y,
        anchoJugador,
        altoJugador
    );
}
}

function moverJugadorEnMapa(evento) {
    if (sectionVerMapa.style.display === "none") {
        return;
    }

    switch (evento.key) {
        case "ArrowUp":
            teclasPresionadas.arriba = true;
            evento.preventDefault();
            break;

        case "ArrowDown":
            teclasPresionadas.abajo = true;
            evento.preventDefault();
            break;

        case "ArrowLeft":
            teclasPresionadas.izquierda = true;
            evento.preventDefault();
            break;

        case "ArrowRight":
            teclasPresionadas.derecha = true;
            evento.preventDefault();
            break;
    }
}

function detenerMovimiento(evento) {
    switch (evento.key) {
        case "ArrowUp":
            teclasPresionadas.arriba = false;
            break;

        case "ArrowDown":
            teclasPresionadas.abajo = false;
            break;

        case "ArrowLeft":
            teclasPresionadas.izquierda = false;
            break;

        case "ArrowRight":
            teclasPresionadas.derecha = false;
            break;
    }
}
function actualizarMovimiento() {
    if (sectionVerMapa.style.display === "none" || !jugador) return;

    if (teclasPresionadas.arriba) posicionJugador.y -= velocidadJugador;
    if (teclasPresionadas.abajo) posicionJugador.y += velocidadJugador;
    if (teclasPresionadas.izquierda) posicionJugador.x -= velocidadJugador;
    if (teclasPresionadas.derecha) posicionJugador.x += velocidadJugador;

    posicionJugador.x = Math.max(
        0,
        Math.min(posicionJugador.x, mapa.width - anchoJugador)
    );

    posicionJugador.y = Math.max(
        0,
        Math.min(posicionJugador.y, mapa.height - altoJugador)
    );

    dibujarMapa();
}


function actualizarMovimientoEnemigo() {
    if (sectionVerMapa.style.display === "none" || !enemigo || !jugador) {
        return;
    }

    // Calculamos la distancia entre los personajes
    const centroJugadorX = posicionJugador.x + anchoJugador / 2;
    const centroJugadorY = posicionJugador.y + altoJugador / 2;

    const centroEnemigoX = posicionEnemigo.x + anchoJugador / 2;
    const centroEnemigoY = posicionEnemigo.y + altoJugador / 2;

    const distanciaX = centroJugadorX - centroEnemigoX;
    const distanciaY = centroJugadorY - centroEnemigoY;

    const distancia = Math.sqrt(
        distanciaX ** 2 + distanciaY ** 2
    );

    // Si el jugador está cerca, el enemigo lo persigue
    if (distancia < 250) {
        if (distancia > 5) {
            posicionEnemigo.x += (distanciaX / distancia) * velocidadEnemigo;
            posicionEnemigo.y += (distanciaY / distancia) * velocidadEnemigo;
        }
    } else {
        // Si está lejos, el enemigo patrulla horizontalmente
        posicionEnemigo.x += velocidadEnemigo * posicionEnemigo.direccion;

        if (posicionEnemigo.x <= 0) {
            posicionEnemigo.x = 0;
            posicionEnemigo.direccion = 1;
        }

        if (posicionEnemigo.x + anchoJugador >= mapa.width) {
            posicionEnemigo.x = mapa.width - anchoJugador;
            posicionEnemigo.direccion = -1;
        }
    }

    // Mantener al enemigo dentro del mapa
    posicionEnemigo.x = Math.max(
        0,
        Math.min(posicionEnemigo.x, mapa.width - anchoJugador)
    );

    posicionEnemigo.y = Math.max(
        0,
        Math.min(posicionEnemigo.y, mapa.height - altoJugador)
    );

    dibujarMapa();
}


function detectarEncuentro() {
    if (
        sectionVerMapa.style.display === "none" ||
        !jugador ||
        !enemigo ||
        encuentroActivo
    ) {
        return;
    }

    // Límites del jugador
    const izquierdaJugador = posicionJugador.x;
    const derechaJugador = posicionJugador.x + anchoJugador;
    const arribaJugador = posicionJugador.y;
    const abajoJugador = posicionJugador.y + altoJugador;

    // Límites del enemigo
    const izquierdaEnemigo = posicionEnemigo.x;
    const derechaEnemigo = posicionEnemigo.x + anchoJugador;
    const arribaEnemigo = posicionEnemigo.y;
    const abajoEnemigo = posicionEnemigo.y + altoJugador;

    // Comprobamos si los rectángulos se superponen
    const hayColision = !(
        abajoJugador <= arribaEnemigo ||
        arribaJugador >= abajoEnemigo ||
        derechaJugador <= izquierdaEnemigo ||
        izquierdaJugador >= derechaEnemigo
    );

    if (hayColision) {
        encuentroActivo = true;
        avisoEncuentro.style.display = "block";
    }
}


function iniciarCombateDesdeMapa() {
    avisoEncuentro.style.display = "none";
    continuarAlCombate();
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

    botonCombatir.addEventListener("click", iniciarCombateDesdeMapa);
    window.addEventListener("keydown", moverJugadorEnMapa);
    window.addEventListener("keyup", detenerMovimiento);

    // Mostrar únicamente el inicio al cargar
    seccionInicio.style.display = "block";
    seccionReglas.style.display = "none";
    seccionPersonaje.style.display = "none";
    seccionAtaque.style.display = "none";
    seccionMensajes.style.display = "none";
    seccionReiniciar.style.display = "none";
    sectionVerMapa.style.display = "none";

    intervaloMovimiento = setInterval(actualizarMovimiento, 16);
    setInterval(actualizarMovimientoEnemigo, 16);
    setInterval(detectarEncuentro, 100);

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
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('reproductor-musica');
    const botonMute = document.getElementById('boton-mute');
    const barraVolumen = document.getElementById('barra-volumen');

    if (!audio || !botonMute || !barraVolumen) return;

    // 1. Iniciar música en el primer clic del usuario en la página
    const activarAudioEnPrimerClic = () => {
        audio.play().catch(error => {
            console.log("Autoplay bloqueado por el navegador:", error);
        });
    };

    document.addEventListener('click', activarAudioEnPrimerClic, { once: true });

    // Evitar propagación de clics dentro de la barra de volumen
    barraVolumen.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});