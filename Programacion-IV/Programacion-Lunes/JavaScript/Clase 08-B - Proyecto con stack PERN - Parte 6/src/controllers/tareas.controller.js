import { pool } from "../db.js";

export const getTareas = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM tareas ORDER BY id DESC");
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getTarea = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM tareas WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: ["La tarea no existe"] });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createTarea = async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;

    const result = await pool.query(
      "INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *",
      [titulo, descripcion]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateTarea = async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;

    const result = await pool.query(
      "UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *",
      [titulo, descripcion, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: ["La tarea no existe"] });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteTarea = async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM tareas WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: ["La tarea no existe"] });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};