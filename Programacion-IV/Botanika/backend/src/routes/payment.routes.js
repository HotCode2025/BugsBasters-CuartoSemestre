const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Definición del endpoint para crear la preferencia de pago
router.post('/create-preference', (req, res) => paymentController.createPreference(req, res));

// Endpoint Webhook / IPN para notificaciones automáticas de Mercado Pago
router.post('/webhook', (req, res) => paymentController.handleWebhook(req, res));
router.get('/webhook', (req, res) => paymentController.handleWebhook(req, res));

module.exports = router;
