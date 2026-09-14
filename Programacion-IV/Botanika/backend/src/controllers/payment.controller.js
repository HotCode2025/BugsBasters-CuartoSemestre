const paymentService = require('../services/payment.service');

class PaymentController {
    /**
     * Endpoint para generar una preferencia de pago en Mercado Pago.
     * POST /api/payments/create-preference
     */
    async createPreference(req, res) {
        try {
            const { items, shippingCost, payer, clientUrl } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Debes enviar al menos un producto en el carrito.'
                });
            }

            const originUrl = clientUrl || req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);

            const preference = await paymentService.createPreference({
                items,
                shippingCost: Number(shippingCost) || 0,
                payer: payer || {},
                clientUrl: originUrl
            });

            return res.status(200).json({
                success: true,
                preferenceId: preference.id,
                initPoint: preference.init_point,
                sandboxInitPoint: preference.sandbox_init_point,
                checkoutUrl: preference.checkoutUrl,
                isSandbox: preference.isSandbox
            });
        } catch (error) {
            console.error('Error al crear preferencia en Mercado Pago:', error);

            // Si el error es por Access Token no configurado o inválido
            const isAuthError = 
                error.status === 401 || 
                error.status === 403 || 
                error.message?.includes('token') || 
                error.message?.includes('UNAUTHORIZED');

            let message = error.message || 'Error al procesar el pago con Mercado Pago.';
            if (isAuthError) {
                message = 'Error de autenticación con Mercado Pago: asegúrate de colocar el "Access Token" (que empieza con TEST-... o APP_USR-...) en el archivo .env, no el User ID.';
            }

            return res.status(error.status || 500).json({
                success: false,
                message
            });
        }
    }

    /**
     * Webhook / Notificación IPN de Mercado Pago.
     * Recibe notificaciones automáticas cuando un pago cambia de estado.
     * POST /api/payments/webhook
     */
    async handleWebhook(req, res) {
        try {
            // Mercado Pago puede notificar por req.body o req.query (IPN)
            const body = req.body || {};
            const query = req.query || {};

            const eventType = body.type || query.type || query.topic;
            const paymentId = (body.data && body.data.id) || query.id || query['data.id'];

            console.log(`🔔 Notificación recibida de Mercado Pago: tipo="${eventType}", ID="${paymentId}"`);

            // Responder inmediatamente 200 OK a Mercado Pago para confirmar recepción y evitar reintentos continuos
            res.status(200).json({ received: true, status: 'acknowledged' });

            // Si el evento es sobre un pago y tenemos el ID, consultamos el estado real con el SDK
            if ((eventType === 'payment' || query.topic === 'payment') && paymentId) {
                try {
                    const paymentInfo = await paymentService.getPaymentById(paymentId);
                    console.log(`💳 [Mercado Pago Webhook] Pago ID ${paymentId}: estado="${paymentInfo.status}" (${paymentInfo.status_detail}) por $${paymentInfo.transaction_amount}`);
                } catch (fetchError) {
                    console.warn(`⚠️ [Mercado Pago Webhook] No se pudo obtener detalle del pago ${paymentId}:`, fetchError.message);
                }
            }
        } catch (error) {
            console.error('Error al procesar webhook de Mercado Pago:', error.message);
            if (!res.headersSent) {
                res.status(200).json({ received: true, error: error.message });
            }
        }
    }
}

module.exports = new PaymentController();
