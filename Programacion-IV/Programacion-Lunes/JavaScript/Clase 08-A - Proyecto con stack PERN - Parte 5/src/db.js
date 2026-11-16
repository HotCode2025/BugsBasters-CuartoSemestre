import pg from 'pg';

export const pool = new pg.Pool({
    user: "postgres",          // Tu usuario de Postgres (ej. postgres)
    password: "admin",         // Tu contraseña de pgAdmin
    host: "localhost",         // Servidor local
    port: 5432,                // Puerto por defecto de Postgres
    database: "PERN"         // El nombre de tu Base de Datos
});

pool.on('connect', () => {
    console.log('¡Conexión exitosa a la base de datos PostgreSQL!');
});
