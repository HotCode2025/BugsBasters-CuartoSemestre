CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
)