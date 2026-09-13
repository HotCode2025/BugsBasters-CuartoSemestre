Botanika & Co. — E-commerce & Sistema de Diseño UI/UX

Documento de apoyo para presentación y defensa del proyecto.

1. Introducción y Propósito del Proyecto

Botanika & Co. es un prototipo de E-commerce moderno, minimalista y funcional enfocado en la venta de plantas de interior y accesorios de diseño (macetas artesanales, sustratos armados y kits de iniciación).

El objetivo principal de este desarrollo fue diseñar una experiencia de usuario (UX) y una interfaz (UI) optimizada bajo el enfoque Mobile-First, garantizando fluidez, estética cálida inspirada en la naturaleza (tonos verdes, terracota y arena), y un flujo de compra completo simulado sin dependencias de backend complejas.

2. Estructura de Archivos (Arquitectura del Código)

El proyecto está modularizado en tres archivos principales para separar responsabilidades de forma limpia y mantenible:

index.html: Contiene la estructura esquelética HTML5, la integración con Tailwind CSS (vía CDN con configuración de colores personalizados), la inclusión de iconos vectoriales mediante Lucide Icons, y los contenedores dinámicos del DOM.

styles.css: Hoja de estilos complementaria encargada de definir configuraciones globales, barras de desplazamiento personalizadas y comportamiento de smooth scrolling.

script.js: El núcleo de la aplicación en JavaScript vainilla (Vanilla JS). Maneja:

La base de datos mock de productos y el estado global del carrito (cart).

El sistema de enrutamiento SPA (Single Page Application) mediante la función navigateTo(view, param).

El renderizado dinámico de vistas (Home, Catálogo, Detalle de Producto, Carrito, Checkout, Perfil, Éxito y Guía de Estilos).

Funciones de interacción de usuario (toast notifications, aplicación de cupones de descuento como BOTANIKA10, actualización de cantidades y menús responsive).

3. Pantallas y Flujo del E-commerce

Durante la exposición, se puede demostrar el recorrido completo del usuario (User Journey):

Home (Página Principal): Diseñada para capturar la atención visual con un banner hero impactante, accesos rápidos por categoría (Plantas, Macetas, Sustratos, Kits), secciones de Más Vendidos y Nuevos Ingresos, además de un banner educativo de cuidado de plantas.

Catálogo: Incorpora un panel lateral de filtros avanzados (por categoría, requerimiento de luz y estilo/color de maceta) y un selector de ordenamiento por relevancia y precio.

Ficha de Producto: Vista de detalle con galería de imágenes, selector de variantes de maceta, ficha técnica visual de cuidados (luz, riego, ubicación) y botón de adición rápida.

Carrito de Compras: Listado interactivo con control de unidades, cálculo automático de subtotal, campo interactivo para validación de cupones de descuento (prueba con BOTANIKA10 para un 10% OFF) y estimación de costos de envío.

Checkout (Finalizar Compra): Formulario estructurado en tres bloques lógicos: datos de envío, selección de método de transporte especializado y simulación de medios de pago (tarjeta, mercado pago, transferencia).

Confirmación de Compra: Pantalla de éxito con número de orden único (#BOT-84920) y resumen del pedido.

Perfil de Usuario: Panel personal que simula el historial de pedidos anteriores, direcciones guardadas y lista de deseos (Wishlist).

Guía de Estilos (Design System): Sección técnica que documenta la paleta de colores oficial, la jerarquía tipográfica y los componentes reutilizables (botones, inputs, badges).

4. Tecnologías y Decisiones de Diseño Clave

Tailwind CSS: Utilizado mediante script de configuración en tiempo de ejecución para inyectar una paleta de colores personalizada (botanika-50 hasta botanika-800, sumando acentos en terracota).

Enfoque SPA en JavaScript: Permite cambiar de "pantallas" instantáneamente sin recargar la página web, ofreciendo una experiencia similar a una aplicación móvil nativa (PWA).

Accesibilidad y Micro-interacciones: Uso de toast notifications flotantes para dar feedback inmediato al usuario cada vez que añade un producto al carrito, cambia filtros o aplica un descuento.

Desarrollado para fines académicos y profesionales como demostración de maquetación web frontend avanzada y diseño centrado en el usuario.