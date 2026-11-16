# Bomba JS

Página web que simula el botón de autodestrucción de una bomba, hecha con HTML, CSS y JavaScript puro.

**Ver el proyecto funcionando:** https://arielmazara.github.io/bomba-js/

## Cómo se usa

1. Hacé click en la cubierta de cristal para abrirla.
2. Presioná el botón rojo: empieza a sonar la alarma y aparece la cuenta regresiva.
3. Presioná **ABORT** antes de que llegue a cero para desactivar la bomba.
4. Si llega a cero, la bomba explota. Cuando termina la explosión aparece una flecha para volver a empezar.
5. El botón de abajo a la derecha silencia el sonido.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `index.html` | La estructura: la escena 3D, el panel de cuenta regresiva, la explosión y los audios |
| `css/style.css` | Todo el estilo: la bomba isométrica en 3D, el panel rojo y las animaciones de la explosión |
| `prueba.js` | La lógica: abrir la cubierta, la cuenta regresiva, abortar, explotar y reiniciar |
| `sound/alarma.mp3` | Sonido de la alarma durante la cuenta regresiva |
| `sound/explosion.wav` | Sonido de la explosión |

## Cómo correrlo en tu compu

Abrí la carpeta con la extensión Live Server de VS Code, o con cualquier servidor local:

```bash
python3 -m http.server 5500
```

y entrá a http://localhost:5500

## Cambios en HTML

Ya comence con todo el HTML, donde cargue todo lo necesario, pero al final tuve que hacer unas modificaciones de etiquetas en HTML que no iba a ocupar.
