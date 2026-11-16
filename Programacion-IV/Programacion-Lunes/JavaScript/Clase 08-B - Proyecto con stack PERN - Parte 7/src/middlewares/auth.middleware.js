import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const isAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: ["No estás autorizado"] });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: ["Sesión inválida o expirada"] });
    }

    req.userId = decoded.id;
    next();
  });
};