/**
 * =============================================================================
 * BOTANIKA & CO. — E-COMMERCE SINGLE PAGE APPLICATION (SPA)
 * =============================================================================
 * Arquitectura: Frontend reactivo en Vanilla JS (ES6+) sin recarga de página.
 * Estilos: Tailwind CSS (vía CDN) + Lucide Icons + Google Fonts.
 * Módulo: Lógica de negocio, gestión de estado y renderizado dinámico de vistas.
 * =============================================================================
 */

/**
 * @typedef {Object} Product
 * @property {number} id - Identificador único del producto.
 * @property {string} name - Nombre comercial del producto.
 * @property {string} category - Categoría ('Plantas' | 'Macetas' | 'Sustratos' | 'Kits').
 * @property {number} price - Precio unitario en moneda local.
 * @property {string} image - URL de la imagen del producto (Unsplash).
 * @property {string} light - Requerimiento de luz solar ('Indirecta' | 'Mucha luz' | 'Poca luz' | 'N/A').
 * @property {string} size - Tamaño físico o volumen ('Pequeña' | 'Mediana' | 'Grande' | '20cm' | '5L').
 * @property {string} pot - Estilo o tipo de maceta/empaque.
 * @property {string} badge - Etiqueta promocional o distintiva ('Más Vendido' | 'Nuevo' | 'Esencial' | 'Kit' | '').
 */

/**
 * Catálogo mock de productos disponibles en la tienda.
 * @type {Product[]}
 */
const products = [
    { id: 1, name: "Monstera Deliciosa", category: "Plantas", price: 34000, image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600", light: "Indirecta", size: "Mediana", pot: "Terracota", badge: "Más Vendido" },
    { id: 2, name: "Ficus Lyrata", category: "Plantas", price: 48000, image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600", light: "Mucha luz", size: "Grande", pot: "Cerámica Beige", badge: "Nuevo" },
    { id: 3, name: "Maceta Minimal Terracota 20cm", category: "Macetas", price: 12500, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600", light: "N/A", size: "20cm", pot: "Terracota", badge: "" },
    { id: 4, name: "Sustrato Premium Monsteras 5L", category: "Sustratos", price: 8900, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600", light: "N/A", size: "5L", pot: "Bolsa Eco", badge: "Esencial" },
    { id: 5, name: "Kit Principiante: Sansevieria + Maceta", category: "Kits", price: 29000, image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=600", light: "Poca luz", size: "Mediana", pot: "Cerámica Blanca", badge: "Kit" },
    { id: 6, name: "Pilea Peperomioides", category: "Plantas", price: 21000, image: "https://images.unsplash.com/photo-1637967888100-d83beabf90a1?auto=format&fit=crop&q=80&w=600", light: "Indirecta", size: "Pequeña", pot: "Cerámica Gris", badge: "Nuevo" }
];

/**
 * @typedef {Object} CartItem
 * @property {number} id - ID del producto.
 * @property {string} name - Nombre del producto.
 * @property {number} price - Precio unitario.
 * @property {number} qty - Cantidad seleccionada.
 * @property {string} image - URL miniatura de la imagen.
 * @property {string} pot - Estilo de maceta seleccionado.
 */

/**
 * Estado global del carrito de compras en memoria.
 * @type {CartItem[]}
 */
let cart = [
    { id: 1, name: "Monstera Deliciosa", price: 34000, qty: 1, image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=200", pot: "Terracota Artesanal" },
    { id: 3, name: "Maceta Minimal Terracota 20cm", price: 12500, qty: 1, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200", pot: "Estándar" }
];

/** @type {'home'|'catalog'|'product'|'cart'|'checkout'|'profile'|'success'|'styleguide'} Vista activa en la SPA */
let currentView = 'home';

/** @type {number} ID del producto a renderizar en la vista de detalle */
let currentProductId = 1;

/** @type {boolean} Indicador de validez del cupón de descuento promocional (10% OFF) */
let discountApplied = false;

/** @type {'mercadopago'|'card'|'transfer'} Método de pago seleccionado en el checkout */
let selectedPaymentMethod = 'mercadopago';

/** @type {'express'|'free'} Tipo de logística seleccionada en el checkout */
let selectedShippingMethod = 'express';

/** @type {string|null} Identificador de la transacción de pago retornado por Mercado Pago */
let lastPaymentId = null;

/**
 * Enrutador central de la SPA. Cambia la vista activa y renderiza el contenido sin recargar.
 * @param {'home'|'catalog'|'product'|'cart'|'checkout'|'profile'|'success'|'styleguide'} view - Nombre de la vista destino.
 * @param {number} [param] - Parámetro opcional (ej. ID de producto para la vista 'product').
 */
function navigateTo(view, param) {
    currentView = view;
    if (param) currentProductId = param;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderView();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Alterna la visibilidad del menú desplegable de navegación en dispositivos móviles.
 */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

/**
 * Muestra una notificación emergente (Toast) no bloqueante durante 3 segundos.
 * @param {string} msg - Mensaje a exhibir en la notificación.
 */
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

/**
 * Recalcula la sumatoria total de unidades en el carrito y sincroniza la burbuja del header.
 */
function updateCartBadge() {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = totalItems;
}

/**
 * Añade un producto al carrito de compras o incrementa su cantidad si ya existe.
 * @param {number} id - Identificador único del producto a incorporar.
 */
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image, pot: product.pot });
    }
    updateCartBadge();
    showToast(`"${product.name}" agregado al carrito`);
}

/**
 * Despachador reactivo de vistas. Inyecta el HTML correspondiente en el contenedor `#main-content`.
 */
function renderView() {
    const main = document.getElementById('main-content');
    updateCartBadge();

    switch (currentView) {
        case 'home':
            main.innerHTML = renderHome();
            break;
        case 'catalog':
            main.innerHTML = renderCatalog();
            break;
        case 'product':
            main.innerHTML = renderProductDetail();
            break;
        case 'cart':
            main.innerHTML = renderCart();
            break;
        case 'checkout':
            main.innerHTML = renderCheckout();
            break;
        case 'profile':
            main.innerHTML = renderProfile();
            break;
        case 'success':
            main.innerHTML = renderSuccess();
            break;
        case 'styleguide':
            main.innerHTML = renderStyleGuide();
            break;
        default:
            main.innerHTML = renderHome();
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Renderiza la pantalla principal (Home): Hero banner, categorías rápidas,
 * más vendidos, banner informativo de cuidados y nuevos ingresos.
 * @returns {string} Markup HTML de la vista Home.
 */
function renderHome() {
    return `
        <!-- Hero Banner -->
        <section class="relative bg-botanika-100 overflow-hidden py-16 md:py-24 border-b border-botanika-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div class="space-y-6">
                    <span class="inline-block bg-botanika-200 text-botanika-800 text-xs tracking-widest uppercase font-semibold px-3 py-1.5 rounded-full">Nueva Colección Otoño</span>
                    <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-botanika-800 leading-tight">
                        Naturaleza viva <br><span class="italic text-botanika-600">para tus espacios</span>
                    </h1>
                    <p class="text-botanika-700 text-base sm:text-lg max-w-lg leading-relaxed">
                        Curamos plantas de interior excepcionales y diseñamos macetas artesanales que aportan equilibrio, diseño y calma a tu hogar.
                    </p>
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                        <button onclick="navigateTo('catalog')" class="bg-botanika-600 hover:bg-botanika-700 text-white font-medium px-8 py-3.5 rounded-xl transition shadow-sm text-center">Explorar Catálogo</button>
                        <button onclick="navigateTo('product', 1)" class="bg-transparent border border-botanika-600 text-botanika-800 hover:bg-botanika-200/50 font-medium px-8 py-3.5 rounded-xl transition text-center">Ver Destacada</button>
                    </div>
                </div>
                <div class="relative flex justify-center">
                    <div class="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-botanika-200/60 -z-10 filter blur-2xl"></div>
                    <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=700" alt="Planta Ficus Lyrata" class="rounded-2xl shadow-xl object-cover h-[380px] sm:h-[450px] w-full max-w-md transform hover:scale-[1.01] transition duration-500">
                </div>
            </div>
        </section>

        <!-- Categorías Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center max-w-xl mx-auto mb-12 space-y-2">
                <h2 class="font-serif text-3xl font-medium">Explora por Categoría</h2>
                <p class="text-botanika-700 text-sm">Todo lo que tus plantas necesitan para crecer sanas y hermosas.</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                ${['Plantas', 'Macetas', 'Sustratos', 'Kits'].map((cat, idx) => {
        const images = [
            "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=400"
        ];
        return `
                        <div onclick="navigateTo('catalog')" class="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition h-64 flex items-end p-6">
                            <img src="${images[idx]}" alt="${cat}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            <div class="absolute inset-0 bg-gradient-to-t from-botanika-800/80 via-botanika-800/20 to-transparent"></div>
                            <div class="relative z-10 text-white">
                                <h3 class="font-serif text-xl font-medium">${cat}</h3>
                                <p class="text-xs text-botanika-200 mt-1 flex items-center">Ver colección <i data-lucide="arrow-right" class="w-3.5 h-3.5 ml-1"></i></p>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </section>

        <!-- Más Vendidos -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex justify-between items-end mb-8">
                <div>
                    <span class="text-botanika-terracota font-semibold text-xs tracking-widest uppercase">Favoritos de la temporada</span>
                    <h2 class="font-serif text-3xl font-medium mt-1">Más Vendidos</h2>
                </div>
                <button onclick="navigateTo('catalog')" class="text-sm font-medium hover:text-botanika-600 flex items-center">Ver todo <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i></button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${products.slice(0, 4).map(p => renderProductCard(p)).join('')}
            </div>
        </section>

        <!-- Banner Tips de Cuidado -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-botanika-200/50 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-botanika-300">
                <div class="space-y-4">
                    <span class="text-xs font-bold tracking-widest uppercase bg-botanika-600 text-white px-3 py-1 rounded-md">Academia Botanika</span>
                    <h3 class="font-serif text-3xl text-botanika-800">¿Cómo cuidar tu Monstera en invierno?</h3>
                    <p class="text-botanika-700 text-sm leading-relaxed">
                        Las plantas de origen tropical necesitan menor frecuencia de riego durante los meses fríos y mayor exposición a la luz natural indirecta. Descubre nuestros tips profesionales.
                    </p>
                    <button onclick="showToast('Guía descargada exitosamente')" class="inline-flex items-center space-x-2 text-sm font-semibold text-botanika-600 hover:text-botanika-800">
                        <span>Descargar Guía PDF Gratuita</span>
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </button>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600" alt="Cuidados de plantas" class="rounded-2xl shadow-md w-full h-64 object-cover">
                </div>
            </div>
        </section>

        <!-- Nuevos Ingresos -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex justify-between items-end mb-8">
                <div>
                    <span class="text-botanika-terracota font-semibold text-xs tracking-widest uppercase">Recién llegados del vivero</span>
                    <h2 class="font-serif text-3xl font-medium mt-1">Nuevos Ingresos</h2>
                </div>
                <button onclick="navigateTo('catalog')" class="text-sm font-medium hover:text-botanika-600 flex items-center">Ver todo <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i></button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                ${products.slice(2, 6).map(p => renderProductCard(p)).join('')}
            </div>
        </section>
    `;
}

/**
 * Componente funcional atómico: Renderiza la tarjeta visual de un producto.
 * @param {Product} p - Objeto producto con sus propiedades.
 * @returns {string} Markup HTML de la tarjeta de producto.
 */
function renderProductCard(p) {
    return `
        <div class="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-botanika-200 flex flex-col justify-between">
            <div>
                <div class="relative rounded-xl overflow-hidden bg-botanika-50 h-64 mb-4 cursor-pointer" onclick="navigateTo('product', ${p.id})">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    ${p.badge ? `<span class="absolute top-3 left-3 bg-botanika-800/90 text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full">${p.badge}</span>` : ''}
                    <button onclick="event.stopPropagation(); showToast('Agregado a favoritos');" class="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-botanika-800 hover:text-botanika-terracota transition">
                        <i data-lucide="heart" class="w-4 h-4"></i>
                    </button>
                </div>
                <h3 onclick="navigateTo('product', ${p.id})" class="font-medium text-botanika-800 cursor-pointer hover:text-botanika-600 transition line-clamp-1">${p.name}</h3>
                <p class="text-xs text-botanika-700 mt-1">${p.category} • Maceta ${p.pot}</p>
            </div>
            <div class="flex items-center justify-between mt-4 pt-3 border-t border-botanika-100">
                <span class="font-serif font-semibold text-lg">$${p.price.toLocaleString()}</span>
                <button onclick="addToCart(${p.id})" class="bg-botanika-600 hover:bg-botanika-700 text-white p-2.5 rounded-xl transition flex items-center space-x-1 text-xs font-medium">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                    <span class="hidden sm:inline">Agregar</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * Renderiza la pantalla del catálogo completo de productos con filtros interactivos
 * (categorías, requerimiento lumínico y estilo de maceta) y barra de ordenamiento.
 * @returns {string} Markup HTML de la vista Catálogo.
 */
function renderCatalog() {
    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-8">
                <h1 class="font-serif text-3xl font-medium">Catálogo de Productos</h1>
                <p class="text-botanika-700 text-sm mt-1">Explora nuestra selección completa de plantas, macetas de diseño y sustratos.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Filtros Laterales -->
                <div class="bg-white p-6 rounded-2xl border border-botanika-200 h-fit space-y-6">
                    <div class="flex justify-between items-center border-b border-botanika-200 pb-4">
                        <h3 class="font-medium text-lg flex items-center"><i data-lucide="sliders-horizontal" class="w-4 h-4 mr-2"></i> Filtros</h3>
                        <button onclick="showToast('Filtros restablecidos')" class="text-xs text-botanika-terracota underline font-medium">Limpiar</button>
                    </div>

                    <!-- Categoría -->
                    <div>
                        <h4 class="text-xs font-bold tracking-wider uppercase text-botanika-800 mb-3">Categoría</h4>
                        <div class="space-y-2 text-sm">
                            <label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked class="rounded border-botanika-300 text-botanika-600 focus:ring-botanika-600"> <span>Plantas de Interior</span></label>
                            <label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked class="rounded border-botanika-300 text-botanika-600 focus:ring-botanika-600"> <span>Macetas & Soportes</span></label>
                            <label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked class="rounded border-botanika-300 text-botanika-600 focus:ring-botanika-600"> <span>Sustratos & Nutrientes</span></label>
                            <label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked class="rounded border-botanika-300 text-botanika-600 focus:ring-botanika-600"> <span>Kits Completos</span></label>
                        </div>
                    </div>

                    <!-- Luz Requerida -->
                    <div class="border-t border-botanika-200 pt-5">
                        <h4 class="text-xs font-bold tracking-wider uppercase text-botanika-800 mb-3">Luz Requerida</h4>
                        <div class="space-y-2 text-sm">
                            <label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" class="rounded border-botanika-300 text-botanika-600"> <span>Mucha luz indirecta</span></label>
                            <label class="flex items-center space-x-2 cursor-pointer"><input type="checkbox" class="rounded border-botanika-300 text-botanika-600"> <span>Luz moderada / Sombra</span></label>
                        </div>
                    </div>

                    <!-- Color de Maceta -->
                    <div class="border-t border-botanika-200 pt-5">
                        <h4 class="text-xs font-bold tracking-wider uppercase text-botanika-800 mb-3">Estilo de Maceta</h4>
                        <div class="flex space-x-3">
                            <button class="w-8 h-8 rounded-full bg-botanika-terracota ring-2 ring-offset-2 ring-botanika-terracota" title="Terracota"></button>
                            <button class="w-8 h-8 rounded-full bg-botanika-sand border border-botanika-300" title="Beige"></button>
                            <button class="w-8 h-8 rounded-full bg-botanika-800" title="Antracita"></button>
                            <button class="w-8 h-8 rounded-full bg-white border border-botanika-300" title="Blanco"></button>
                        </div>
                    </div>

                    <button onclick="showToast('Filtros aplicados')" class="w-full bg-botanika-600 hover:bg-botanika-700 text-white rounded-xl py-3 text-sm font-medium transition">Aplicar Filtros</button>
                </div>

                <!-- Grid de Productos y Ordenamiento -->
                <div class="lg:col-span-3 space-y-6">
                    <!-- Barra de Orden -->
                    <div class="bg-white p-4 rounded-2xl border border-botanika-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                        <span class="text-sm text-botanika-700">Mostrando <strong>6</strong> productos</span>
                        <div class="flex items-center space-x-2 text-sm">
                            <span class="text-botanika-700">Ordenar por:</span>
                            <select class="bg-botanika-50 border border-botanika-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-botanika-600">
                                <option>Relevancia</option>
                                <option>Precio: Menor a Mayor</option>
                                <option>Precio: Mayor a Menor</option>
                                <option>Novedades</option>
                            </select>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${products.map(p => renderProductCard(p)).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza la ficha técnica detallada del producto seleccionado (currentProductId):
 * migas de pan, galería con miniaturas, selector de estilo de maceta,
 * especificaciones de cuidado (luz, riego, ubicación), botón de compra y productos relacionados.
 * @returns {string} Markup HTML de la vista de detalle de producto.
 */
function renderProductDetail() {
    const product = products.find(p => p.id === currentProductId) || products[0];
    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <!-- Migas de pan -->
            <div class="text-xs text-botanika-700 mb-6 flex items-center space-x-2">
                <button onclick="navigateTo('home')" class="hover:underline">Home</button>
                <span>/</span>
                <button onclick="navigateTo('catalog')" class="hover:underline">Catálogo</button>
                <span>/</span>
                <span class="text-botanika-800 font-medium">${product.name}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <!-- Galería -->
                <div class="space-y-4">
                    <div class="rounded-3xl overflow-hidden bg-white border border-botanika-200 h-[450px] sm:h-[520px]">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <img src="${product.image}" class="rounded-xl h-24 w-full object-cover border-2 border-botanika-600 cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=300" class="rounded-xl h-24 w-full object-cover border border-botanika-200 cursor-pointer opacity-70 hover:opacity-100 transition">
                        <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=300" class="rounded-xl h-24 w-full object-cover border border-botanika-200 cursor-pointer opacity-70 hover:opacity-100 transition">
                    </div>
                </div>

                <!-- Detalles -->
                <div class="space-y-6">
                    <div>
                        <span class="bg-botanika-200 text-botanika-800 text-xs uppercase font-semibold px-3 py-1 rounded-full">${product.badge || 'Stock Disponible'}</span>
                        <h1 class="font-serif text-4xl text-botanika-800 mt-3">${product.name}</h1>
                        <p class="font-serif text-2xl text-botanika-terracota font-semibold mt-2">$${product.price.toLocaleString()}</p>
                    </div>

                    <p class="text-botanika-700 text-sm leading-relaxed">
                        Planta cultivada en vivero especializado con sustrato orgánico premium y maceta de diseño artesanal con drenaje optimizado. Ideal para aportar vida y frescura a cualquier ambiente interior.
                    </p>

                    <!-- Selector de Maceta / Tamaño -->
                    <div class="space-y-3 pt-2">
                        <label class="text-xs font-bold tracking-wider uppercase text-botanika-800 block">Selecciona Estilo de Maceta:</label>
                        <div class="grid grid-cols-3 gap-3">
                            <button class="border-2 border-botanika-600 bg-white p-3 rounded-xl text-center text-sm font-medium">Terracota Natural</button>
                            <button class="border border-botanika-300 bg-white p-3 rounded-xl text-center text-sm font-medium hover:border-botanika-600">Cerámica Blanca</button>
                            <button class="border border-botanika-300 bg-white p-3 rounded-xl text-center text-sm font-medium hover:border-botanika-600">Cerámica Gris</button>
                        </div>
                    </div>

                    <!-- Ficha de Cuidados Card -->
                    <div class="bg-white p-5 rounded-2xl border border-botanika-200 grid grid-cols-3 gap-4 text-center">
                        <div class="space-y-1">
                            <i data-lucide="sun" class="w-5 h-5 mx-auto text-botanika-terracota"></i>
                            <span class="text-[11px] uppercase tracking-wider text-botanika-700 block font-bold">Luz</span>
                            <span class="text-xs font-medium">${product.light}</span>
                        </div>
                        <div class="space-y-1 border-x border-botanika-200">
                            <i data-lucide="droplet" class="w-5 h-5 mx-auto text-botanika-600"></i>
                            <span class="text-[11px] uppercase tracking-wider text-botanika-700 block font-bold">Riego</span>
                            <span class="text-xs font-medium">Cada 7-10 días</span>
                        </div>
                        <div class="space-y-1">
                            <i data-lucide="home" class="w-5 h-5 mx-auto text-botanika-600"></i>
                            <span class="text-[11px] uppercase tracking-wider text-botanika-700 block font-bold">Ubicación</span>
                            <span class="text-xs font-medium">Interior luminoso</span>
                        </div>
                    </div>

                    <!-- Botón Agregar -->
                    <div class="flex space-x-4 pt-4">
                        <button onclick="addToCart(${product.id})" class="flex-grow bg-botanika-600 hover:bg-botanika-700 text-white font-medium py-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2">
                            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                            <span>Agregar al Carrito</span>
                        </button>
                        <button onclick="showToast('Agregado a favoritos')" class="p-4 border border-botanika-300 rounded-xl hover:bg-botanika-100 transition">
                            <i data-lucide="heart" class="w-5 h-5 text-botanika-800"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Productos Relacionados -->
            <div class="mt-20">
                <h3 class="font-serif text-2xl font-medium mb-6">También te puede encantar</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${products.slice(0, 4).map(p => renderProductCard(p)).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza la pantalla del carrito de compras: listado reactivo de ítems,
 * controles de incremento/decremento de cantidades, aplicación de cupones de descuento,
 * cálculo de subtotales, costo de envío e importe total.
 * @returns {string} Markup HTML de la vista Carrito.
 */
function renderCart() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discount = discountApplied ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 class="font-serif text-3xl font-medium mb-8">Tu Carrito de Compras</h1>

            ${cart.length === 0 ? `
                <div class="text-center py-20 bg-white rounded-3xl border border-botanika-200">
                    <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto text-botanika-300 mb-4"></i>
                    <h3 class="font-serif text-xl font-medium">Tu carrito está vacío</h3>
                    <p class="text-botanika-700 text-sm mt-1 mb-6">Aún no has agregado plantas ni accesorios.</p>
                    <button onclick="navigateTo('catalog')" class="bg-botanika-600 text-white px-6 py-3 rounded-xl font-medium text-sm">Ir al Catálogo</button>
                </div>
            ` : `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Lista de Ítems -->
                    <div class="lg:col-span-2 space-y-4">
                        ${cart.map((item, idx) => `
                            <div class="bg-white p-4 sm:p-6 rounded-2xl border border-botanika-200 flex items-center justify-between space-x-4">
                                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-xl object-cover bg-botanika-50 flex-shrink-0">
                                <div class="flex-grow">
                                    <h3 class="font-medium text-botanika-800">${item.name}</h3>
                                    <p class="text-xs text-botanika-700 mt-0.5">Maceta: ${item.pot}</p>
                                    <p class="font-serif font-semibold text-botanika-800 mt-1">$${item.price.toLocaleString()}</p>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="flex items-center border border-botanika-300 rounded-lg">
                                        <button onclick="updateQty(${idx}, -1)" class="px-2.5 py-1 text-botanika-700 hover:bg-botanika-100">-</button>
                                        <span class="px-3 text-sm font-medium">${item.qty}</span>
                                        <button onclick="updateQty(${idx}, 1)" class="px-2.5 py-1 text-botanika-700 hover:bg-botanika-100">+</button>
                                    </div>
                                    <button onclick="removeItem(${idx})" class="p-2 text-botanika-700 hover:text-botanika-terracota transition">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Resumen del Pedido -->
                    <div class="bg-white p-6 rounded-2xl border border-botanika-200 h-fit space-y-6">
                        <h3 class="font-serif text-xl font-medium border-b border-botanika-200 pb-4">Resumen del Pedido</h3>
                        
                        <!-- Código de Descuento -->
                        <div class="flex space-x-2">
                            <input type="text" id="discount-input" placeholder="Código (ej: BOTANIKA10)" class="bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm flex-grow focus:outline-none focus:border-botanika-600">
                            <button onclick="applyDiscount()" class="bg-botanika-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-botanika-700 transition">Aplicar</button>
                        </div>

                        <div class="space-y-3 text-sm pt-2">
                            <div class="flex justify-between text-botanika-700">
                                <span>Subtotal</span>
                                <span>$${subtotal.toLocaleString()}</span>
                            </div>
                            ${discountApplied ? `
                                <div class="flex justify-between text-botanika-terracota">
                                    <span>Descuento (10%)</span>
                                    <span>-$${discount.toLocaleString()}</span>
                                </div>
                            ` : ''}
                            <div class="flex justify-between text-botanika-700">
                                <span>Envío estimado</span>
                                <span>$3,500</span>
                            </div>
                            <div class="flex justify-between font-serif font-semibold text-lg text-botanika-800 pt-3 border-t border-botanika-200">
                                <span>Total</span>
                                <span>$${(total + 3500).toLocaleString()}</span>
                            </div>
                        </div>

                        <button onclick="navigateTo('checkout')" class="w-full bg-botanika-600 hover:bg-botanika-700 text-white rounded-xl py-3.5 text-sm font-medium transition text-center block shadow-sm">
                            Continuar Compra
                        </button>
                    </div>
                </div>
            `}
        </div>
    `;
}

/**
 * Actualiza la cantidad de un ítem en el carrito. Si la cantidad desciende a 0 o menor,
 * remueve automáticamente el ítem de la colección.
 * @param {number} index - Índice del ítem dentro del array `cart`.
 * @param {number} change - Variación de cantidad (+1 o -1).
 */
function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    renderView();
}

/**
 * Elimina un producto del carrito por su posición de índice y dispara feedback visual.
 * @param {number} index - Índice del ítem a remover.
 */
function removeItem(index) {
    cart.splice(index, 1);
    renderView();
    showToast('Producto eliminado del carrito');
}

/**
 * Valida y aplica un cupón de descuento promocional.
 * Clave válida: 'BOTANIKA10' para un 10% OFF.
 */
function applyDiscount() {
    const val = document.getElementById('discount-input').value.trim();
    if (val.toUpperCase() === 'BOTANIKA10') {
        discountApplied = true;
        showToast('¡Descuento aplicado con éxito!');
        renderView();
    } else {
        showToast('Código inválido (prueba BOTANIKA10)');
    }
}

/**
 * Renderiza el proceso de Checkout: formulario de datos de entrega,
 * selección de logística de transporte (Envío Protegido vs Retiro) y métodos de pago.
 * @returns {string} Markup HTML de la vista Checkout.
 */
/**
 * Cambia el método de pago seleccionado en el checkout y refresca la vista.
 * @param {'mercadopago'|'card'|'transfer'} method
 */
function setPaymentMethod(method) {
    selectedPaymentMethod = method;
    renderView();
}

/**
 * Cambia la modalidad de logística seleccionada y refresca la vista.
 * @param {'express'|'free'} method
 */
function setShippingMethod(method) {
    selectedShippingMethod = method;
    renderView();
}

/**
 * Determina dinámicamente la URL base del backend según el entorno de ejecución:
 * - En local (localhost / 127.0.0.1 / file:): se conecta a http://localhost:3000.
 * - En producción (Vercel): utiliza ruta relativa '' apuntando al mismo dominio con HTTPS.
 * - Soporta override manual mediante window.BOTANIKA_API_URL (ej: para backend en Render).
 * @returns {string}
 */
function getApiBaseUrl() {
    if (window.BOTANIKA_API_URL) {
        return window.BOTANIKA_API_URL.replace(/\/+$/, '');
    }
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';
    return isLocal ? 'http://localhost:3000' : '';
}

/**
 * Inicia el flujo de pago con Mercado Pago consumiendo el backend oficial en Express.
 */
async function handleMercadoPagoPayment() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío.');
        return;
    }

    const btn = document.getElementById('checkout-submit-btn');
    const originalContent = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
            <span class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Conectando con Mercado Pago...
            </span>
        `;
    }

    try {
        showToast('Generando orden de pago segura...');
        const shippingCost = selectedShippingMethod === 'free' ? 0 : 3500;
        const buyerName = document.getElementById('buyer-name')?.value?.trim() || 'Lucía';
        const buyerSurname = document.getElementById('buyer-surname')?.value?.trim() || 'Fernández';
        const buyerEmail = document.getElementById('buyer-email')?.value?.trim() || 'comprador_test@botanika.com';

        const apiBaseUrl = getApiBaseUrl();
        // Capturar URL completa actual (limpia de parámetros o hashes) para preservar rutas en entornos locales y producción
        let currentFullUrl = '';
        try {
            if (window.location.href && !window.location.href.startsWith('file:') && !window.location.href.includes('about:blank')) {
                currentFullUrl = window.location.href.split('?')[0].split('#')[0];
            }
        } catch (e) {}

        const clientOrigin = currentFullUrl || ((window.location.origin && window.location.origin !== 'null')
            ? window.location.origin
            : 'https://bugsbasters-cuartosemestre.vercel.app');

        const response = await fetch(`${apiBaseUrl}/api/payments/create-preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                shippingCost,
                clientUrl: clientOrigin,
                payer: {
                    name: buyerName,
                    surname: buyerSurname,
                    email: buyerEmail
                }
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudo generar la preferencia de pago.');
        }

        // Seleccionar URL adecuada para Mercado Pago
        const checkoutUrl = data.checkoutUrl || data.initPoint || data.sandboxInitPoint;
        if (checkoutUrl) {
            const redirectMsg = data.isSandbox 
                ? 'Redirigiendo a Mercado Pago (Modo Sandbox)...' 
                : 'Redirigiendo a Mercado Pago seguro...';
            showToast(redirectMsg);
            setTimeout(() => {
                window.location.href = checkoutUrl;
            }, 400);
        } else {
            throw new Error('No se recibió enlace de pago de Mercado Pago.');
        }
    } catch (error) {
        console.error('Error al procesar pago con Mercado Pago:', error);
        showToast(error.message || 'Error de conexión con el backend.');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalContent;
        }
    }
}

/**
 * Renderiza el proceso de Checkout: formulario de datos de entrega,
 * selección de logística de transporte y métodos de pago (incluyendo Mercado Pago).
 * @returns {string} Markup HTML de la vista Checkout.
 */
function renderCheckout() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discount = discountApplied ? subtotal * 0.1 : 0;
    const shippingCost = selectedShippingMethod === 'free' ? 0 : 3500;
    const total = Math.max(0, subtotal - discount + shippingCost);

    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-8">
                <h1 class="font-serif text-3xl font-medium">Finalizar Compra</h1>
                <p class="text-botanika-700 text-sm mt-1">Completa tus datos para coordinar el envío seguro de tus plantas.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Formulario -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Datos de Envío -->
                    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-serif text-xl font-medium flex items-center"><i data-lucide="map-pin" class="w-5 h-5 mr-2 text-botanika-600"></i> Datos de Envío</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Nombre</label>
                                <input type="text" id="buyer-name" value="Lucía" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Apellido</label>
                                <input type="text" id="buyer-surname" value="Fernández" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Email</label>
                                <input type="email" id="buyer-email" value="lucia.fernandez@example.com" placeholder="tu-email@correo.com" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Dirección</label>
                                <input type="text" value="Av. Libertador 1450, Piso 4B" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Ciudad</label>
                                <input type="text" value="Buenos Aires" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                            </div>
                            <div>
                                <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Código Postal</label>
                                <input type="text" value="1425" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                            </div>
                        </div>
                    </div>

                    <!-- Método de Envío -->
                    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-serif text-xl font-medium flex items-center"><i data-lucide="truck" class="w-5 h-5 mr-2 text-botanika-600"></i> Método de Envío</h3>
                        <div class="space-y-3 pt-2">
                            <label onclick="setShippingMethod('express')" class="flex items-center justify-between p-4 rounded-xl border-2 ${selectedShippingMethod === 'express' ? 'border-botanika-600 bg-botanika-50' : 'border-botanika-300 bg-white hover:border-botanika-600'} cursor-pointer transition">
                                <div class="flex items-center space-x-3">
                                    <input type="radio" name="shipping" ${selectedShippingMethod === 'express' ? 'checked' : ''} class="text-botanika-600 focus:ring-botanika-600">
                                    <div>
                                        <p class="font-medium text-sm">Envío Protegido Especial Botanika (Cuidado de hojas)</p>
                                        <p class="text-xs text-botanika-700">Entrega en 48hs hábiles con empaque climatizado</p>
                                    </div>
                                </div>
                                <span class="font-serif font-semibold">$3,500</span>
                            </label>
                            <label onclick="setShippingMethod('free')" class="flex items-center justify-between p-4 rounded-xl border-2 ${selectedShippingMethod === 'free' ? 'border-botanika-600 bg-botanika-50' : 'border-botanika-300 bg-white hover:border-botanika-600'} cursor-pointer transition">
                                <div class="flex items-center space-x-3">
                                    <input type="radio" name="shipping" ${selectedShippingMethod === 'free' ? 'checked' : ''} class="text-botanika-600 focus:ring-botanika-600">
                                    <div>
                                        <p class="font-medium text-sm">Retiro por Studio Palermo</p>
                                        <p class="text-xs text-botanika-700">Listo en 24hs hábiles en showroom</p>
                                    </div>
                                </div>
                                <span class="font-serif font-semibold text-botanika-600">Gratis</span>
                            </label>
                        </div>
                    </div>

                    <!-- Método de Pago -->
                    <div class="bg-white p-6 sm:p-8 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-serif text-xl font-medium flex items-center"><i data-lucide="credit-card" class="w-5 h-5 mr-2 text-botanika-600"></i> Método de Pago</h3>
                        <div class="grid grid-cols-3 gap-3 pt-2">
                            <button onclick="setPaymentMethod('mercadopago')" class="border-2 ${selectedPaymentMethod === 'mercadopago' ? 'border-[#009EE3] bg-blue-50/60 text-[#009EE3] font-bold shadow-sm' : 'border-botanika-300 bg-white hover:border-botanika-600 font-medium'} p-3 rounded-xl text-center text-sm transition flex items-center justify-center space-x-1">
                                <i data-lucide="wallet" class="w-4 h-4"></i>
                                <span>Mercado Pago</span>
                            </button>
                            <button onclick="setPaymentMethod('card')" class="border-2 ${selectedPaymentMethod === 'card' ? 'border-botanika-600 bg-botanika-50 text-botanika-800 font-bold shadow-sm' : 'border-botanika-300 bg-white hover:border-botanika-600 font-medium'} p-3 rounded-xl text-center text-sm transition">
                                Tarjeta
                            </button>
                            <button onclick="setPaymentMethod('transfer')" class="border-2 ${selectedPaymentMethod === 'transfer' ? 'border-botanika-600 bg-botanika-50 text-botanika-800 font-bold shadow-sm' : 'border-botanika-300 bg-white hover:border-botanika-600 font-medium'} p-3 rounded-xl text-center text-sm transition">
                                Transferencia
                            </button>
                        </div>

                        ${selectedPaymentMethod === 'mercadopago' ? `
                            <div class="bg-[#F5F9FD] border border-[#D0E6F9] rounded-2xl p-5 space-y-3 pt-4">
                                <div class="flex items-center space-x-3">
                                    <div class="bg-[#009EE3] text-white px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase">Recomendado</div>
                                    <span class="text-sm font-semibold text-gray-800">Checkout Oficial Mercado Pago</span>
                                </div>
                                <p class="text-xs text-gray-600 leading-relaxed">
                                    Serás redirigido a la pasarela segura de Mercado Pago. Podrás abonar con dinero en cuenta, tarjetas de crédito/débito y cuotas con todas las promociones bancarias vigentes.
                                </p>
                            </div>
                        ` : selectedPaymentMethod === 'card' ? `
                            <div class="space-y-3 pt-4">
                                <div>
                                    <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Número de Tarjeta</label>
                                    <input type="text" placeholder="4532 •••• •••• 8920" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">Vencimiento</label>
                                        <input type="text" placeholder="MM/AA" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                                    </div>
                                    <div>
                                        <label class="text-xs font-bold uppercase tracking-wider text-botanika-700 block mb-1">CVV</label>
                                        <input type="password" placeholder="•••" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-botanika-600">
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <div class="bg-botanika-50 border border-botanika-200 rounded-2xl p-5 space-y-2 text-xs text-botanika-700">
                                <p class="font-semibold text-botanika-800">Datos Bancarios para Transferencia:</p>
                                <p><strong>Alias:</strong> BOTANIKA.PLANTAS</p>
                                <p><strong>CBU:</strong> 0000003100045892110294</p>
                                <p class="text-[11px] text-botanika-600 mt-2">Envía el comprobante a pagos@botanika.com tras confirmar tu orden.</p>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Resumen y Confirmación -->
                <div class="bg-white p-6 rounded-2xl border border-botanika-200 h-fit space-y-6">
                    <h3 class="font-serif text-xl font-medium border-b border-botanika-200 pb-4">Resumen de Compra</h3>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between text-botanika-700">
                            <span>Subtotal (${cart.reduce((a, b) => a + b.qty, 0)} ítems)</span>
                            <span>$${subtotal.toLocaleString()}</span>
                        </div>
                        ${discountApplied ? `
                            <div class="flex justify-between text-botanika-terracota">
                                <span>Descuento aplicado (10%)</span>
                                <span>-$${discount.toLocaleString()}</span>
                            </div>
                        ` : ''}
                        <div class="flex justify-between text-botanika-700">
                            <span>${selectedShippingMethod === 'free' ? 'Retiro en Studio' : 'Envío Protegido'}</span>
                            <span>${shippingCost === 0 ? 'Gratis' : '$' + shippingCost.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between font-serif font-semibold text-lg text-botanika-800 pt-3 border-t border-botanika-200">
                            <span>Total a Pagar</span>
                            <span>$${total.toLocaleString()}</span>
                        </div>
                    </div>

                    ${selectedPaymentMethod === 'mercadopago' ? `
                        <button id="checkout-submit-btn" onclick="handleMercadoPagoPayment()" class="w-full bg-[#009EE3] hover:bg-[#0082ba] text-white rounded-xl py-4 text-sm font-semibold transition text-center shadow-md flex items-center justify-center space-x-2">
                            <i data-lucide="wallet" class="w-5 h-5"></i>
                            <span>Pagar con Mercado Pago $${total.toLocaleString()}</span>
                        </button>
                    ` : `
                        <button onclick="navigateTo('success'); cart = [];" class="w-full bg-botanika-600 hover:bg-botanika-700 text-white rounded-xl py-4 text-sm font-medium transition text-center shadow-md block">
                            Confirmar y Pagar $${total.toLocaleString()}
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza la pantalla de confirmación y éxito de compra:
 * icono de verificación, número identificador de orden simulado (#BOT-84920) y botón de retorno.
 * @returns {string} Markup HTML de la vista Éxito.
 */
function renderSuccess() {
    const orderNumber = lastPaymentId ? `#MP-${lastPaymentId}` : '#BOT-84920';
    return `
        <div class="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
            <div class="w-20 h-20 bg-botanika-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <i data-lucide="check" class="w-10 h-10"></i>
            </div>
            <span class="text-botanika-terracota font-semibold text-xs tracking-widest uppercase">¡Compra exitosa!</span>
            <h1 class="font-serif text-4xl text-botanika-800">Gracias por tu pedido</h1>
            <p class="text-botanika-700 text-sm max-w-md mx-auto leading-relaxed">
                Hemos recibido tu pago correctamente a través de Mercado Pago. Tu número de comprobante es <strong class="text-botanika-800">${orderNumber}</strong>. Te enviaremos el seguimiento por correo electrónico.
            </p>
            <div class="pt-6">
                <button onclick="navigateTo('home')" class="bg-botanika-600 hover:bg-botanika-700 text-white px-8 py-3.5 rounded-xl font-medium text-sm transition shadow-sm">
                    Seguir Comprando
                </button>
            </div>
        </div>
    `;
}

/**
 * Renderiza el panel de cuenta de usuario (Perfil):
 * datos de la cuenta, historial de pedidos con estado de entrega,
 * libreta de direcciones guardadas y lista de favoritos (Wishlist) con compra rápida.
 * @returns {string} Markup HTML de la vista Perfil.
 */
function renderProfile() {
    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-8 flex justify-between items-center">
                <div>
                    <h1 class="font-serif text-3xl font-medium">Mi Cuenta</h1>
                    <p class="text-botanika-700 text-sm mt-1">Bienvenida, Lucía Fernández (lucia@example.com)</p>
                </div>
                <button onclick="navigateTo('home')" class="text-xs text-botanika-terracota underline font-medium">Cerrar Sesión</button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Historial de Pedidos -->
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white p-6 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-serif text-xl font-medium flex items-center"><i data-lucide="package" class="w-5 h-5 mr-2 text-botanika-600"></i> Historial de Pedidos</h3>
                        <div class="space-y-4 pt-2">
                            <div class="border border-botanika-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                                <div>
                                    <p class="font-medium text-sm">Pedido #BOT-83210</p>
                                    <p class="text-xs text-botanika-700 mt-0.5">2 ítems • Entregado el 12 de Mayo</p>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <span class="bg-botanika-200 text-botanika-800 text-xs font-semibold px-2.5 py-1 rounded-full">Entregado</span>
                                    <button onclick="showToast('Detalle de pedido abierto')" class="text-xs text-botanika-600 font-medium underline">Ver detalle</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-serif text-xl font-medium flex items-center"><i data-lucide="map-pin" class="w-5 h-5 mr-2 text-botanika-600"></i> Direcciones Guardadas</h3>
                        <div class="border border-botanika-200 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p class="font-medium text-sm">Casa Principal</p>
                                <p class="text-xs text-botanika-700 mt-0.5">Av. Libertador 1450, Piso 4B, Buenos Aires</p>
                            </div>
                            <button onclick="showToast('Dirección editada')" class="text-xs text-botanika-600 font-medium underline">Editar</button>
                        </div>
                    </div>
                </div>

                <!-- Wishlist / Favoritos -->
                <div class="bg-white p-6 rounded-2xl border border-botanika-200 space-y-4 h-fit">
                    <h3 class="font-serif text-xl font-medium flex items-center"><i data-lucide="heart" class="w-5 h-5 mr-2 text-botanika-terracota"></i> Mis Favoritos</h3>
                    <div class="space-y-3 pt-2">
                        <div class="flex items-center space-x-3 border-b border-botanika-100 pb-3">
                            <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=150" class="w-14 h-14 rounded-lg object-cover">
                            <div class="flex-grow">
                                <p class="font-medium text-sm">Monstera Deliciosa</p>
                                <p class="text-xs font-semibold text-botanika-terracota">$34,000</p>
                            </div>
                            <button onclick="addToCart(1)" class="p-2 bg-botanika-600 text-white rounded-lg"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza la Guía de Estilos y Especificación del Sistema de Diseño UI/UX (Design System):
 * paleta de colores oficiales, escalas tipográficas y componentes atómicos reutilizables.
 * @returns {string} Markup HTML de la vista Guía de Estilos.
 */
function renderStyleGuide() {
    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            <div class="border-b border-botanika-200 pb-6">
                <span class="text-botanika-terracota font-semibold text-xs tracking-widest uppercase">Sistema de Diseño UI/UX</span>
                <h1 class="font-serif text-4xl font-medium mt-1">Guía de Estilos & Componentes Botanika</h1>
                <p class="text-botanika-700 text-sm mt-2 max-w-2xl">
                    Especificaciones oficiales de diseño minimalista, cálido, enfocado en dispositivos móviles y con paleta inspirada en la naturaleza botánica.
                </p>
            </div>

            <!-- Paleta de Colores -->
            <div class="space-y-4">
                <h2 class="font-serif text-2xl font-medium">Paleta de Colores</h2>
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div class="p-4 rounded-2xl bg-botanika-50 border border-botanika-200 shadow-sm">
                        <div class="h-16 rounded-xl bg-botanika-50 border border-botanika-300 mb-2"></div>
                        <p class="font-medium text-sm">Fondo Principal</p>
                        <p class="text-xs text-botanika-700">#F7F6F2</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-white border border-botanika-200 shadow-sm">
                        <div class="h-16 rounded-xl bg-botanika-200 mb-2"></div>
                        <p class="font-medium text-sm">Arena Suave</p>
                        <p class="text-xs text-botanika-700">#DED8CC</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-white border border-botanika-200 shadow-sm">
                        <div class="h-16 rounded-xl bg-botanika-600 mb-2"></div>
                        <p class="font-medium text-sm">Verde Botánica</p>
                        <p class="text-xs text-botanika-700">#526E5D</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-white border border-botanika-200 shadow-sm">
                        <div class="h-16 rounded-xl bg-botanika-800 mb-2"></div>
                        <p class="font-medium text-sm">Verde Oscuro</p>
                        <p class="text-xs text-botanika-700">#2A3830</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-white border border-botanika-200 shadow-sm">
                        <div class="h-16 rounded-xl bg-botanika-terracota mb-2"></div>
                        <p class="font-medium text-sm">Terracota</p>
                        <p class="text-xs text-botanika-700">#D07A58</p>
                    </div>
                </div>
            </div>

            <!-- Tipografía -->
            <div class="space-y-4">
                <h2 class="font-serif text-2xl font-medium">Tipografía & Jerarquía</h2>
                <div class="bg-white p-8 rounded-2xl border border-botanika-200 space-y-6">
                    <div>
                        <span class="text-xs text-botanika-700 uppercase tracking-widest font-bold block mb-1">Encabezados (Font Serif)</span>
                        <h1 class="font-serif text-4xl">H1: Naturaleza viva para tus espacios</h1>
                    </div>
                    <div>
                        <span class="text-xs text-botanika-700 uppercase tracking-widest font-bold block mb-1">Subtítulos & Secciones</span>
                        <h2 class="font-serif text-2xl">H2: Más Vendidos de la Temporada</h2>
                    </div>
                    <div>
                        <span class="text-xs text-botanika-700 uppercase tracking-widest font-bold block mb-1">Cuerpo de Texto (Sans-Serif / Inter)</span>
                        <p class="text-botanika-700 text-base">Curamos plantas de interior excepcionales y diseñamos macetas artesanales que aportan equilibrio, diseño y calma a tu hogar.</p>
                    </div>
                </div>
            </div>

            <!-- Componentes Reutilizables -->
            <div class="space-y-4">
                <h2 class="font-serif text-2xl font-medium">Componentes Reutilizables</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-medium text-sm text-botanika-700 uppercase">Botones Principales</h3>
                        <button class="w-full bg-botanika-600 text-white py-3 rounded-xl text-sm font-medium">Botón Principal</button>
                        <button class="w-full bg-botanika-800 text-white py-3 rounded-xl text-sm font-medium">Botón Oscuro</button>
                        <button class="w-full border border-botanika-600 text-botanika-800 py-3 rounded-xl text-sm font-medium">Botón Outline</button>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-medium text-sm text-botanika-700 uppercase">Badges y Tags</h3>
                        <div class="flex flex-wrap gap-2">
                            <span class="bg-botanika-800 text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full">Más Vendido</span>
                            <span class="bg-botanika-200 text-botanika-800 text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full">Nuevo Ingreso</span>
                            <span class="bg-botanika-terracota text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full">10% OFF</span>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-botanika-200 space-y-4">
                        <h3 class="font-medium text-sm text-botanika-700 uppercase">Inputs & Formularios</h3>
                        <input type="text" placeholder="Ej. Tu nombre" class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm">
                        <select class="w-full bg-botanika-50 border border-botanika-300 rounded-xl px-4 py-2.5 text-sm">
                            <option>Opción de selección</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Inicialización de la aplicación al completar la carga del documento en el navegador.
 * Detecta si el usuario retorna desde el checkout de Mercado Pago.
 */
function handlePaymentReturnAndInit() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || params.get('collection_status');
    const paymentId = params.get('payment_id') || params.get('collection_id');

    if (paymentId) {
        lastPaymentId = paymentId;
    }

    if (status === 'approved') {
        cart = [];
        navigateTo('success');
        showToast('¡Pago aprobado con éxito vía Mercado Pago!');
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    } else if (status === 'failure' || status === 'rejected') {
        navigateTo('cart');
        showToast('El pago en Mercado Pago fue cancelado o rechazado.');
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    } else if (status === 'pending') {
        navigateTo('profile');
        showToast('Tu pago con Mercado Pago se encuentra en proceso.');
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }

    renderView();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handlePaymentReturnAndInit);
} else {
    handlePaymentReturnAndInit();
}