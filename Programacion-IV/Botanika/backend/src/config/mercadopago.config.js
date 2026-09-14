const path = require('path');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Cargar variables de entorno desde el directorio de trabajo y desde backend/.env
require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function getClient() {
    return new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN || '',
        options: {
            timeout: 7000
        }
    });
}

const client = getClient();

module.exports = {
    client,
    getClient,
    Preference,
    Payment
};


