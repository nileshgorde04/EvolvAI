    import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include our custom 'user' property
// This allows us to safely add the user object to the request after decoding the token
export interface AuthRequest extends Request {
  user?: { id: string; name: string };
}

/**
 * Middleware to protect routes by verifying a JSON Web Token (JWT).
 * This function acts as a gatekeeper for our secure API endpoints.
 *
 * @param req - The Express request object, which we've extended to potentially hold user data.
 * @param res - The Express response object, used to send back error messages.
 * @param next - The next middleware function in the stack. If the token is valid, we call next() to proceed.
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Check if the Authorization header exists and is correctly formatted (starts with "Bearer")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Get the secret key from environment variables
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        // This is a critical server configuration error
        throw new Error('JWT_SECRET is not defined in the environment variables.');
      }

      // 4. Verify the token using the secret key. If it's invalid or expired, this will throw an error.
      const decoded = jwt.verify(token, jwtSecret) as { user: { id: string; name: string } };

      // 5. If verification is successful, attach the decoded user payload to the request object.
      // This makes the user's ID and name available to any subsequent route handlers.
      req.user = decoded.user;

      // 6. Proceed to the next middleware or the actual route handler.
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there's no token at all in the header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
