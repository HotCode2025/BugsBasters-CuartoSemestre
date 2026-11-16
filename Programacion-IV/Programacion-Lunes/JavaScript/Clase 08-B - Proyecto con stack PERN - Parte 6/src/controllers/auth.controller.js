import bcrypt from "bcrypt";
import crypto from "crypto";
import { pool } from "../db.js";
import { createAccessToken } from "../libs/jwt.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // poner true en producción con HTTPS
  maxAge: 24 * 60 * 60 * 1000,
};

const getGravatar = (email) => {
  const hash = crypto.createHash("md5").update(email).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (exists.rowCount > 0) {
      return res
        .status(400)
        .json({ message: ["El correo ya está registrado"] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const gravatar = getGravatar(email);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, gravatar)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, gravatar`,
      [name, email, hashedPassword, gravatar]
    );

    const user = result.rows[0];
    const token = await createAccessToken({ id: user.id });

    res.cookie("token", token, cookieOptions);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ message: ["El correo no está registrado"] });
    }

    const dbUser = result.rows[0];
    const validPassword = await bcrypt.compare(password, dbUser.password);

    if (!validPassword) {
      return res
        .status(400)
        .json({ message: ["La contraseña es incorrecta"] });
    }

    const token = await createAccessToken({ id: dbUser.id });
    res.cookie("token", token, cookieOptions);

    // Nunca devolvemos la contraseña
    return res.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      gravatar: dbUser.gravatar,
    });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie("token");
  return res.sendStatus(204);
};

export const profile = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, gravatar FROM users WHERE id = $1",
      [req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: ["Usuario no encontrado"] });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};