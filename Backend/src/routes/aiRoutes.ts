import { Router } from 'express';
import { handleChat } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware'; // We need the protect middleware again

const router = Router();

// --- AI Routes ---

// @route   POST /api/ai/chat
// @desc    Send a message to the AI chat assistant
// @access  Private (Re-secured)
router.post('/chat', protect, handleChat); // The 'protect' middleware is now active on this route

export default router;
