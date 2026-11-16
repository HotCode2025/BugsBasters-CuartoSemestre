const TIEMPO_INICIAL = 9;

const alarm = document.getElementById("alarm");
const alarm2 = document.getElementById("alarm2");
const panel = document.getElementById("panel");
const explosion = document.getElementById("explosion");
const scene = document.querySelector(".scene");
const closing = document.getElementById("closing");
const time = document.getElementById("time");
const abort = document.getElementById("abort");
const detonate = document.getElementById("detonate");
const cover = document.getElementById("cover");
const btn = document.getElementById("activate");
const reload = document.getElementById("restart");
const mute = document.getElementById("mute");

let theCount = null;
let finExplosion = null;
let segundos = TIEMPO_INICIAL;
alarm.volume = 0.5;

// Muestra el tiempo con formato 00:09
function mostrarTiempo() {
    time.innerText = "00:" + String(segundos).padStart(2, "0");
}

function showCountDown() {
    segundos--;
    mostrarTiempo();
    if (segundos === 0) {
        clearInterval(theCount);
        time.classList.add("crono");
        abort.classList.add("hide");
        detonate.classList.add("show");
        setTimeout(explotar, 1500);
    }
}

// Crea chispas que salen volando en direcciones al azar
function crearChispas(cantidad) {
    for (let i = 0; i < cantidad; i++) {
        const chispa = document.createElement("span");
        const angulo = Math.random() * Math.PI * 2;
        const distancia = 25 + Math.random() * 45; // en vmin
        chispa.className = "spark";
        chispa.style.setProperty("--x", Math.cos(angulo) * distancia + "vmin");
        chispa.style.setProperty("--y", Math.sin(angulo) * distancia + "vmin");
        chispa.style.setProperty("--dur", 0.8 + Math.random() * 1.2 + "s");
        explosion.appendChild(chispa);
    }
}

function mostrarReinicio() {
    clearTimeout(finExplosion);
    reload.classList.add("show");
}

function explotar() {
    panel.classList.remove("show");
    alarm.pause();
    alarm2.currentTime = 0;
    alarm2.play();

    crearChispas(40);
    explosion.classList.add("boom");
    scene.classList.add("shake", "destroyed");
    closing.classList.add("close");

    // La flecha aparece cuando termina el sonido (o a los 8.5 s si está muteado)
    alarm2.onended = mostrarReinicio;
    finExplosion = setTimeout(mostrarReinicio, 8500);
}

// Vuelve todo al estado inicial
function reiniciar() {
    clearInterval(theCount);
    segundos = TIEMPO_INICIAL;
    mostrarTiempo();
    clearTimeout(finExplosion);
    alarm.pause();
    alarm.currentTime = 0;
    alarm2.pause();
    alarm2.onended = null;
    panel.classList.remove("show");
    explosion.classList.remove("boom");
    explosion.querySelectorAll(".spark").forEach(function (chispa) {
        chispa.remove();
    });
    scene.classList.remove("shake", "destroyed");
    closing.classList.remove("close");
    reload.classList.remove("show");
    abort.classList.remove("hide");
    detonate.classList.remove("show");
    time.classList.remove("crono");
    cover.classList.remove("opened");
    btn.classList.remove("pushed");
}

// Abrir / cerrar la cubierta de cristal
cover.addEventListener("click", function () {
    cover.classList.toggle("opened");
});

// Presionar el botón rojo
btn.addEventListener("click", function () {
    if (btn.classList.contains("pushed")) return;
    btn.classList.add("pushed");
    alarm.currentTime = 0;
    alarm.play();
    setTimeout(function () {
        panel.classList.add("show");
        theCount = setInterval(showCountDown, 1000);
    }, 500);
});

abort.addEventListener("click", reiniciar);
reload.addEventListener("click", reiniciar);

mute.addEventListener("click", function () {
    const silenciado = mute.classList.toggle("muted");
    alarm.muted = silenciado;
    alarm2.muted = silenciado;
});

mostrarTiempo();

// La cubierta arranca abierta y se cierra con animación al cargar
setTimeout(function () {
    cover.classList.remove("opened");
}, 100);
