const { client, getClient, Preference, Payment } = require('../config/mercadopago.config');

/**
 * Normaliza y construye URLs válidas para las back_urls de Mercado Pago,
 * asegurando la ruta adecuada al archivo index.html y adjuntando el status correspondiente.
 * @param {string} baseUrl
 * @param {string} status
 * @returns {string}
 */
function formatBackUrl(baseUrl, status) {
    if (!baseUrl) return '';
    try {
        const urlObj = new URL(baseUrl);
        if (urlObj.pathname.endsWith('/')) {
            urlObj.pathname += 'index.html';
        } else if (!urlObj.pathname.endsWith('.html') && !urlObj.pathname.endsWith('.htm')) {
            urlObj.pathname += '/index.html';
        }
        urlObj.searchParams.set('status', status);
        return urlObj.toString();
    } catch (e) {
        let clean = baseUrl.split('?')[0].split('#')[0].replace(/\/+$/, '');
        if (!clean.endsWith('.html') && !clean.endsWith('.htm')) {
            clean += '/index.html';
        }
        return `${clean}?status=${status}`;
    }
}

class PaymentService {
    /**
     * Crea una preferencia de pago en Mercado Pago para el checkout de Botanika.
     * @param {Object} params
     * @param {Array} params.items - Productos provenientes del carrito de compras.
     * @param {number} [params.shippingCost] - Costo de envío seleccionado.
     * @param {Object} [params.payer] - Información del cliente comprador.
     * @param {string} [params.clientUrl] - Origen del frontend para back_urls.
     * @returns {Promise<{ id: string, init_point: string, sandbox_init_point: string, checkoutUrl: string, isSandbox: boolean }>}
     */
    async createPreference({ items, shippingCost = 0, payer = {}, clientUrl = null }) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error('El carrito no contiene productos válidos.');
        }

        const mpClient = typeof getClient === 'function' ? getClient() : client;
        const preference = new Preference(mpClient);

        // Formatear los ítems según los requerimientos del SDK de Mercado Pago
        const mpItems = items.map((item) => ({
            id: String(item.id),
            title: item.name || 'Producto Botanika',
            description: item.pot ? `Variante: ${item.pot}` : 'Planta / Accesorio Botanika & Co.',
            picture_url: item.image || '',
            quantity: Number(item.qty || item.quantity || 1),
            unit_price: Number(item.price),
            currency_id: 'ARS'
        }));

        // Si existe costo de envío, lo añadimos como concepto transparente
        if (shippingCost && Number(shippingCost) > 0) {
            mpItems.push({
                id: 'shipping-charge',
                title: 'Envío Protegido Especial Botanika',
                description: 'Entrega en 48hs con empaque climatizado para plantas',
                quantity: 1,
                unit_price: Number(shippingCost),
                currency_id: 'ARS'
            });
        }

        // Determinar URL de retorno a la web del cliente.
        // NOTA CRÍTICA MERCADO PAGO:
        // Mercado Pago exige HTTPS para auto_return: 'approved' (redirección automática instantánea).
        // Si se envían URLs con http:// (ej: localhost sin túnel), Mercado Pago descarta las back_urls
        // y deshabilita auto_return.
        // Por ello:
        // 1. Si clientUrl es HTTPS (ej: túnel ngrok/localtunnel o dominio productivo), usamos clientUrl.
        // 2. Si clientUrl es local HTTP pero CLIENT_URL en .env es HTTPS, priorizamos CLIENT_URL (.env) para garantizar auto_return.
        // 3. De lo contrario, usamos clientUrl o process.env.CLIENT_URL o fallback en Vercel.
        let targetUrl = '';
        if (clientUrl && clientUrl.startsWith('https://')) {
            targetUrl = clientUrl;
        } else if (process.env.CLIENT_URL && process.env.CLIENT_URL.startsWith('https://')) {
            targetUrl = process.env.CLIENT_URL;
        } else {
            targetUrl = clientUrl || process.env.CLIENT_URL || 'https://bugsbasters-cuartosemestre.vercel.app';
        }

        const successUrl = formatBackUrl(targetUrl, 'approved');
        const failureUrl = formatBackUrl(targetUrl, 'failure');
        const pendingUrl = formatBackUrl(targetUrl, 'pending');

        // Detectar si las credenciales son de Sandbox o Producción
        const mpToken = process.env.MP_ACCESS_TOKEN || '';
        const isSandbox = mpToken.startsWith('TEST-') || mpToken.includes('test');

        const preferenceBody = {
            items: mpItems,
            payer: {
                name: payer.name || 'Cliente',
                surname: payer.surname || 'Botanika',
                email: payer.email || 'comprador_test@botanika.com'
            },
            back_urls: {
                success: successUrl,
                failure: failureUrl,
                pending: pendingUrl
            },
            statement_descriptor: 'BOTANIKA'
        };

        // Configuración de Webhook (notification_url):
        // Mercado Pago exige una URL pública accesible (HTTPS o túnel como ngrok).
        // En localhost plano sin túnel no se debe enviar porque la API rechaza con error 400.
        const backendUrl = (process.env.BACKEND_URL || '').replace(/\/+$/, '');
        const isBackendPublic = backendUrl.startsWith('https://') || 
            (backendUrl && !backendUrl.includes('localhost') && !backendUrl.includes('127.0.0.1'));

        if (isBackendPublic) {
            preferenceBody.notification_url = `${backendUrl}/api/payments/webhook`;
        }

        // Mercado Pago exige HTTPS para auto_return
        if (successUrl.startsWith('https://')) {
            preferenceBody.auto_return = 'approved';
            console.log(`✅ [Mercado Pago Preference] Redirección automática activa (auto_return: approved) -> ${successUrl}`);
        } else {
            console.log(`ℹ️ [Mercado Pago Preference] Redirección configurada por botón de retorno -> ${successUrl}`);
        }

        const preferenceData = {
            body: preferenceBody
        };

        const response = await preference.create(preferenceData);

        // En Mercado Pago moderno, init_point gestiona automáticamente tanto el entorno de prueba como producción.
        // sandbox_init_point está deprecado por Mercado Pago y es bloqueado por CloudFront con 403.
        const checkoutUrl = response.init_point;

        return {
            id: response.id,
            init_point: response.init_point,
            sandbox_init_point: response.sandbox_init_point,
            checkoutUrl,
            isSandbox
        };
    }

    /**
     * Consulta el estado de un pago en Mercado Pago a partir de su ID.
     * Utilizado principalmente por el Webhook para confirmar acreditaciones.
     * @param {string|number} paymentId
     * @returns {Promise<Object>}
     */
    async getPaymentById(paymentId) {
        const mpClient = typeof getClient === 'function' ? getClient() : client;
        const payment = new Payment(mpClient);
        const result = await payment.get({ id: paymentId });
        return {
            id: result.id,
            status: result.status,
            status_detail: result.status_detail,
            date_approved: result.date_approved,
            transaction_amount: result.transaction_amount,
            payer: result.payer
        };
    }
}

module.exports = new PaymentService();
