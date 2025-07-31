import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { exportUserData, deleteAllUserData } from '../controllers/settingsController';

const router = Router();

// All routes here are protected
router.use(protect);

router.get('/export', exportUserData);
router.delete('/delete-all', deleteAllUserData);

export default router;