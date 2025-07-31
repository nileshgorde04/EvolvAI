import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { awardXp, XP_REWARDS } from '../utils/xpUtils';

// --- Goal Management (Optimized) ---

/**
 * Fetches all goals and their associated tasks for the logged-in user using an efficient single query.
 */
export const getGoals = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const query = `
            SELECT 
                g.id, 
                g.title, 
                g.created_at,
                COALESCE(
                    (SELECT json_agg(
                        json_build_object(
                            'id', t.id, 
                            'name', t.name, 
                            'is_completed', t.is_completed
                        ) ORDER BY t.created_at ASC
                    ) 
                    FROM tasks t WHERE t.goal_id = g.id), 
                    '[]'::json
                ) as tasks
            FROM goals g
            WHERE g.user_id = $1
            ORDER BY g.created_at DESC;
        `;
        const goalsResult = await pool.query(query, [userId]);
        res.status(200).json(goalsResult.rows);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Server error while fetching goals.' });
    }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Goal title is required.' });
    }

    try {
        const newGoal = await pool.query(
            'INSERT INTO goals (user_id, title) VALUES ($1, $2) RETURNING *',
            [userId, title]
        );
        res.status(201).json(newGoal.rows[0]);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ message: 'Server error while creating goal.' });
    }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { goalId } = req.params;

    try {
        await pool.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [goalId, userId]);
        res.status(200).json({ message: 'Goal deleted successfully.' });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ message: 'Server error while deleting goal.' });
    }
};


// --- Task Management ---

export const addTask = async (req: AuthRequest, res: Response) => {
    const { goalId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Task name is required.' });
    }

    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (goal_id, name) VALUES ($1, $2) RETURNING *',
            [goalId, name]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Server error while adding task.' });
    }
};

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

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { taskId } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error while deleting task.' });
    }
};


// --- AI Task Generation ---
let genAI: GoogleGenerativeAI;
try {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found.");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (e) { console.error(e); }

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateTasksWithAI = async (req: AuthRequest, res: Response) => {
    if (!genAI) return res.status(500).json({ message: 'AI service not configured.' });

    const { goalTitle } = req.body;
    if (!goalTitle) {
        return res.status(400).json({ message: 'Goal title is required.' });
    }

    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const prompt = `
                An EvolvAI user wants to achieve the following goal: "${goalTitle}".
                Your task is to break this goal down into a series of actionable, bite-sized tasks.
                Provide between 5 and 8 tasks.
                Your response MUST be a valid JSON object with a single key "tasks" which is an array of strings.
                Example: { "tasks": ["First task.", "Second task.", "Third task."] }
            `;

            const result = await model.generateContent(prompt);
            let responseText = result.response.text();

            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                responseText = jsonMatch[1];
            }

            const generated = JSON.parse(responseText);
            return res.status(200).json(generated);

        } catch (error: any) {
            if (error.status === 503 && retries > 1) {
                console.log(`[AI Goals]: Model is overloaded. Retrying in ${delay / 1000}s... (${retries - 1} retries left)`);
                await sleep(delay);
                retries--;
                delay *= 2;
            } else {
                console.error("Error during AI task generation:", error);
                return res.status(500).json({ message: "Failed to generate tasks with AI." });
            }
        }
    }
};