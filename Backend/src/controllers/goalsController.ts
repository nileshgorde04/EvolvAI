import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { awardXp, XP_REWARDS } from '../utils/xpUtils'; // Import XP utils

// ... (getGoals, createGoal, deleteGoal, addTask functions remain the same)
export const getGoals = async (req: AuthRequest, res: Response) => { /* ... */ };
export const createGoal = async (req: AuthRequest, res: Response) => { /* ... */ };
export const deleteGoal = async (req: AuthRequest, res: Response) => { /* ... */ };
export const addTask = async (req: AuthRequest, res: Response) => { /* ... */ };


export const updateTask = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { taskId } = req.params;
    const { is_completed } = req.body;

    if (typeof is_completed !== 'boolean') {
        return res.status(400).json({ message: 'is_completed must be a boolean.' });
    }

    try {
        const taskBeforeUpdate = await pool.query('SELECT is_completed FROM tasks WHERE id = $1', [taskId]);
        const wasCompleted = taskBeforeUpdate.rows[0]?.is_completed;

        const updatedTask = await pool.query(
            'UPDATE tasks SET is_completed = $1 WHERE id = $2 RETURNING *',
            [is_completed, taskId]
        );

        if (is_completed && !wasCompleted && userId) {
            await awardXp(userId, XP_REWARDS.TASK_COMPLETED);
        }

        res.status(200).json(updatedTask.rows[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error while updating task.' });
    }
};

// ... (deleteTask and generateTasksWithAI functions remain the same)
export const deleteTask = async (req: AuthRequest, res: Response) => { /* ... */ };
export const generateTasksWithAI = async (req: AuthRequest, res: Response) => { /* ... */ };