const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const paymentRoutes = require('./routes/payment.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendRoot = path.join(__dirname, '../../');

// Middlewares globales
app.use(cors({
    origin: '*', // Permite peticiones desde Live Server (127.0.0.1 / localhost)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación de salud de la API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'Botanika & Co. Backend API',
        timestamp: new Date().toISOString()
    });
});

// Enrutamiento de la API
app.use('/api/payments', paymentRoutes);

// Servir frontend estático de Botanika (HTML, CSS, JS, assets)
app.use(express.static(frontendRoot));

// Manejador para rutas de API no encontradas (404)
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta de API ${req.originalUrl} no encontrada.`
    });
});

// Fallback para la SPA (sirve index.html para cualquier navegación web)
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(frontendRoot, 'index.html'));
    }
    next();
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Ocurrió un error inesperado en el servidor.'
    });
});

// Inicio del servidor en modo independiente (Local / Node)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(`🌿 Botanika API Backend inicializada`);
        console.log(`🚀 Servidor escuchando en: http://localhost:${PORT}`);
        console.log(`💳 Endpoint Mercado Pago: http://localhost:${PORT}/api/payments/create-preference`);
        console.log(`🔔 Endpoint Webhooks:     http://localhost:${PORT}/api/payments/webhook`);
        console.log(`🩺 Health Check:           http://localhost:${PORT}/api/health`);
        console.log(`=========================================`);
    });
}

module.exports = app;

