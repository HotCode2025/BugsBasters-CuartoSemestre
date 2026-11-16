import { pool } from "../db.js";

export const listarTareas = async (req, res, next) => {
    try {
        const resultado = await pool.query('SELECT * FROM tareas');
        console.log(resultado);
        return res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

export const listarTarea = async (req, res, next) => {
    try {
        const resultado = await pool.query('SELECT * FROM tareas WHERE id = $1', [req.params.id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({
                message: 'Tarea no encontrada'
            });
        }
        return res.json(resultado.rows[0]); 
    } catch (error) {
        next(error);
    }
}

export const crearTarea = async (req, res, next) => {
    const { titulo, descripcion } = req.body;

    try {
        const result = await pool.query('INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *', [titulo, descripcion]);
        res.json(result.rows[0]);
        console.log(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).send('La tarea ya existe');
        }
        next(error);
    }
}

export const actualizarTarea = async (req, res, next) => {
    const { titulo, descripcion } = req.body;
    const { id } = req.params; // 
    try {
        const result = await pool.query(
            'UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *', 
            [titulo, descripcion, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'No existe tarea con ese ID'
            });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        next(error); 
    }
}

export const eliminarTarea = async (req, res, next) => {
    try {
        const resultado = await pool.query('DELETE FROM tareas WHERE id = $1', [req.params.id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({
                message: 'No existe tarea con ese ID'
            });
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error(error); 
        next(error);
    }
}
