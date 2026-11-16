import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../libs/jwt.js';
import md5 from 'md5'; // 💡 LÍNEA NUEVA DEL VIDEO

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'El correo no está registrado' });
        }

        const validPassword = await bcrypt.compare(password, result.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ message: 'La contraseña es incorrecta' });
        }

        const token = await createAccessToken({ id: result.rows[0].id });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "none",
            maxAge: 60 * 60 * 24 * 1000,
        });

        return res.json(result.rows[0]);

    } catch (error) {
        next(error);
    }
};

export const signup = async (req, res, next) => {
    const { name, email, password }  = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 💡 LÍNEA NUEVA: Generamos el hash md5 del email y armamos la URL de Gravatar
        const gravatar = "https://gravatar.com" + md5(email);
        
        // CORREGIDO: Añadimos 'gravatar' como cuarta columna y $4 en los VALUES
        const result = await pool.query(
            'INSERT INTO users (name, email, password, gravatar) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, email, hashedPassword, gravatar]
        );
        
        const token = await createAccessToken({ id: result.rows[0].id });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "none",
            maxAge: 60 * 60 * 24 * 1000,
        });

        return res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El correo ya esta registrado' });
        }
        next(error);
    }
};

export const signout = (req, res) => {
    res.clearCookie('token');
    return res.json({ message: "Sesion cerrada" });
};

export const profile = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);
        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};
