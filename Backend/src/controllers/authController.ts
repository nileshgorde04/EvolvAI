import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db'; // Our database connection pool

/**
 * Handles new user registration.
 * @param req - The Express request object. Expects name, email, and password in the body.
 * @param res - The Express response object.
 */
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // 1. Basic Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    // 2. Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // 3. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Insert the new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password_hash]
    );

    // 5. Respond with the created user data (excluding the password hash)
    res.status(201).json(newUser.rows[0]);

  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * Handles user login.
 * @param req - The Express request object. Expects email and password in the body.
 * @param res - The Express response object.
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Basic Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // 2. Find the user by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Use a generic message for security
    }
    const user = userResult.rows[0];

    // 3. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Use a generic message for security
    }

    // 4. User is valid, create a JWT (JSON Web Token)
    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '7d' }, // Token expires in 7 days
      (err, token) => {
        if (err) throw err;
        // 5. Send the token back to the client
        res.status(200).json({ token });
      }
    );

  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
