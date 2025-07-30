import { Router } from 'express';
import { createOrUpdateLog, getLogsForUser, analyzeLog } from '../controllers/journalController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// --- Journal Routes (Protected) ---

router.get('/', protect, getLogsForUser);
router.post('/', protect, createOrUpdateLog);

// Route to get AI analysis for a specific log
router.post('/analyze', protect, analyzeLog);

export default router;