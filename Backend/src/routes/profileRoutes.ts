import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getProfileData, updateProfile } from '../controllers/profileController';

const router = Router();

router.get('/', protect, getProfileData);
router.put('/', protect, updateProfile);

export default router;