import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../libs/jwt.js';

export const signin = (req, res) => res.send('ingresando');

export const signup = async (req, res, next) => {
    const { name, email, password }  = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        
        // Cambié "usuarios" por "users" por si tu tabla se llama así. Si se llama usuarios, ponelo en plural.
        const result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hashedPassword]);
        
        const token = await createAccessToken({ id: result.rows[0].id });
        console.log(result);

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
        next(error); // Evita que se quede en Processing si la tabla no existe o falla otra cosa
    }
};

export const signout = (req, res) => res.send('Cerrando sesion');

export const profile = (req, res) => res.send('Perfil de usuario');

