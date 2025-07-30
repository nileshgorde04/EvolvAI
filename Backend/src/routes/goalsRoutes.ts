import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
    getGoals, 
    createGoal, 
    deleteGoal,
    addTask,
    updateTask,
    deleteTask,
    generateTasksWithAI
} from '../controllers/goalsController';

const router = Router();

// All routes in this file are protected and require a valid token
router.use(protect);

// --- Goal Routes ---
router.route('/')
    .get(getGoals)
    .post(createGoal);

router.route('/:goalId')
    .delete(deleteGoal);

// --- Task Routes ---
router.route('/:goalId/tasks')
    .post(addTask);

router.route('/tasks/:taskId')
    .put(updateTask)
    .delete(deleteTask);

// --- AI Route ---
router.post('/ai-generate-tasks', generateTasksWithAI);


export default router;