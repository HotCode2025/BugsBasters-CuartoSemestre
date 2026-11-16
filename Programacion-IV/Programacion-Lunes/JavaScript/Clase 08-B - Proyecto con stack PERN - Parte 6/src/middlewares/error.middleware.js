export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: ["Ruta no encontrada"] });
};

export const errorHandler = (err, req, res, next) => {
  // JSON mal formado en el body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: ["El JSON enviado no es válido"] });
  }

  // Violación de UNIQUE en PostgreSQL (por ejemplo, email repetido)
  if (err.code === "23505") {
    return res.status(400).json({ message: ["El correo ya está registrado"] });
  }

  console.error(err);
  res.status(500).json({ message: ["Error interno del servidor"] });
};