import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getProfileData } from '../controllers/profileController';

const router = Router();

// This route is protected, only logged-in users can access it.
router.get('/', protect, getProfileData);

export default router;