import { Router } from 'express';
import { handleChat } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// This line is crucial. It must be exactly like this.
router.post('/chat', protect, handleChat);

export default router;