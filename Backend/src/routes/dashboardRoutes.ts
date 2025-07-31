import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getDashboardData } from '../controllers/dashboardController';

const router = Router();

// Protect this route, only logged-in users can see their dashboard
router.get('/', protect, getDashboardData);

export default router;