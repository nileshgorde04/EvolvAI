import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Fetches all of a user's data for export.
 */
export const exportUserData = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const userPromise = pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [userId]);
        const logsPromise = pool.query('SELECT * FROM daily_logs WHERE user_id = $1', [userId]);
        const goalsPromise = pool.query('SELECT * FROM goals WHERE user_id = $1', [userId]);
        const tasksPromise = pool.query(`
            SELECT t.* FROM tasks t
            INNER JOIN goals g ON t.goal_id = g.id
            WHERE g.user_id = $1
        `, [userId]);

        const [userResult, logsResult, goalsResult, tasksResult] = await Promise.all([
            userPromise, logsPromise, goalsPromise, tasksPromise
        ]);

        const data = {
            user: userResult.rows[0],
            daily_logs: logsResult.rows,
            goals: goalsResult.rows,
            tasks: tasksResult.rows
        };

        res.status(200).json(data);
    } catch (error) {
        console.error('Error exporting user data:', error);
        res.status(500).json({ message: 'Server error while exporting data.' });
    }
};

/**
 * Deletes all of a user's content (logs, goals, tasks).
 */
export const deleteAllUserData = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        // The database schema's "ON DELETE CASCADE" will handle deleting tasks when goals are deleted.
        await pool.query('DELETE FROM daily_logs WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM goals WHERE user_id = $1', [userId]);
        
        res.status(200).json({ message: 'All user data has been deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user data:', error);
        res.status(500).json({ message: 'Server error while deleting data.' });
    }
};