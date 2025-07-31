import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/db';
import { sendPasswordResetEmail } from '../utils/email';

// --- (registerUser and loginUser functions remain the same) ---
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { return res.status(400).json({ message: 'Please provide all fields.' }); }
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) { return res.status(409).json({ message: 'User already exists.' }); }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const newUser = await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, password_hash]);
        res.status(201).json(newUser.rows[0]);
    } catch (error) { res.status(500).json({ message: 'Server error.' }); }
};
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'Please provide all fields.' }); }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) { return res.status(401).json({ message: 'Invalid credentials.' }); }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) { return res.status(401).json({ message: 'Invalid credentials.' }); }
        const payload = { user: { id: user.id, name: user.name } };
        const jwtSecret = process.env.JWT_SECRET!;
        jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
    } catch (error) { res.status(500).json({ message: 'Server error.' }); }
};

// --- NEW CODE-BASED PASSWORD RESET ---

/**
 * Step 1: User provides email, we generate and "send" a code.
 */
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(200).json({ message: 'If a user with that email exists, a code has been sent.' });
        }
        
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
            [hashedCode, tokenExpiry, email]
        );

        // --- SEND THE REAL EMAIL ---
        await sendPasswordResetEmail({
            to: email,
            subject: 'Your EvolvAI Password Reset Code',
            resetCode: resetCode,
        });
        // -------------------------

        res.status(200).json({ message: 'A 6-digit reset code has been sent to your email.' });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: 'Server error while sending reset code.' });
    }
};

/**
 * Step 2: User provides the code and new password to reset.
 */
export const resetPassword = async (req: Request, res: Response) => {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
        return res.status(400).json({ message: 'Email, code, and new password are required.' });
    }

    try {
        const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND reset_password_token = $2 AND reset_password_expires > NOW()',
            [email, hashedCode]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired code.' });
        }
        const user = userResult.rows[0];

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await pool.query(
            'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
            [password_hash, user.id]
        );

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};