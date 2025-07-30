import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { handleChat } from '../controllers/aiController';

// Create a new router instance
const router = Router();

// --- Authentication Routes ---

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', loginUser);

router.post('/chat', handleChat);

// Export the router to be used in the main server file
export default router;
