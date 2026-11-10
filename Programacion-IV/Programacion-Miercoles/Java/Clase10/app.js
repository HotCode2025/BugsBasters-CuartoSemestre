"use strict";

const api = "/api/v1/reservas";
const form = document.querySelector("#reserva");
const lista = document.querySelector("#visitas");
const estado = document.querySelector("#estado");
const plantilla = document.querySelector("#fila");
const recargar = document.querySelector("#recargar");

const experiencias = Object.fromEntries(
    Array.from(form.elements.experiencia.options, opcion => [
        opcion.value,
        opcion.text
    ])
);

let versionListado = 0;

async function solicitar(ruta, opciones = {}) {
    const respuesta = await fetch(api + ruta, opciones);

    if (!respuesta.ok) {
        const mensajes = {
            400: "Revisá los datos ingresados.",
            404: "La reserva ya no existe."
        };

        throw new Error(
            mensajes[respuesta.status] || "No se pudo completar la operación."
        );
    }

    return respuesta.status === 204 ? null : respuesta.json();
}

function informar(error) {
    estado.textContent = error instanceof TypeError
        ? "No se pudo conectar con la API."
        : error.message;
}

function crearFila(reserva) {
    const fila = plantilla.content.firstElementChild.cloneNode(true);

    fila.classList.toggle("presente", reserva.asistio);
    fila.querySelector("h3").textContent = reserva.visitante;
    fila.querySelector(".hora").textContent = reserva.hora.slice(0, 5);

    const [anio, mes, dia] = reserva.fecha.split("-");
    fila.querySelector(".fecha").textContent = [dia, mes, anio].join("/");

    const cantidad = reserva.personas === 1
        ? "1 persona"
        : reserva.personas + " personas";

    fila.querySelector(".experiencia").textContent =
        experiencias[reserva.experiencia] + " · " + cantidad;

    fila.querySelector(".estado-visita").textContent =
        reserva.asistio ? "Asistió" : "Pendiente";

    const asistencia = fila.querySelector(".asistencia");
    asistencia.textContent = reserva.asistio
        ? "Deshacer asistencia"
        : "Registrar asistencia";

    asistencia.addEventListener("click", () => {
        const ruta = "/" + reserva.id + "/asistencia?asistio=" + !reserva.asistio;
        modificarFila(fila, ruta, "PATCH");
    });

    fila.querySelector(".eliminar").addEventListener("click", () => {
        if (window.confirm("¿Eliminar la reserva de " + reserva.visitante + "?")) {
            modificarFila(fila, "/" + reserva.id, "DELETE");
        }
    });

    return fila;
}

async function actualizar() {
    const version = ++versionListado;

    try {
        const reservas = await solicitar("");

        if (version !== versionListado) return;

        lista.replaceChildren(...reservas.map(crearFila));

        if (reservas.length === 0) {
            estado.textContent = "Todavía no hay reservas.";
        } else if (reservas.length === 1) {
            estado.textContent = "1 reserva";
        } else {
            estado.textContent = reservas.length + " reservas";
        }
    } catch (error) {
        if (version === versionListado) informar(error);
    }
}

async function modificarFila(fila, ruta, metodo) {
    const botones = fila.querySelectorAll("button");
    botones.forEach(boton => boton.disabled = true);

    try {
        await solicitar(ruta, { method: metodo });
        await actualizar();
    } catch (error) {
        informar(error);
    } finally {
        botones.forEach(boton => boton.disabled = false);
    }
}

form.addEventListener("submit", async evento => {
    evento.preventDefault();

    const datos = Object.fromEntries(new FormData(form));
    datos.visitante = datos.visitante.trim();
    datos.personas = Number(datos.personas);

    if (!datos.visitante) {
        estado.textContent = "Ingresá el nombre del visitante.";
        form.elements.visitante.focus();
        return;
    }

    const boton = form.querySelector("button");
    boton.disabled = true;

    try {
        await solicitar("", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        form.reset();
        await actualizar();
    } catch (error) {
        informar(error);
    } finally {
        boton.disabled = false;
    }
});

recargar.addEventListener("click", actualizar);
actualizar();
