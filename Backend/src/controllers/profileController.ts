import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Calculates the user's current consecutive day streak from their logs.
 * @param logs - An array of log objects with a `log_date` property.
 * @returns The number of consecutive days in the streak.
 */
const calculateStreak = (logs: { log_date: Date }[]): number => {
    if (logs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if the most recent log is today or yesterday
    const mostRecentLogDate = new Date(logs[0].log_date);
    if (mostRecentLogDate.getTime() === today.getTime() || mostRecentLogDate.getTime() === yesterday.getTime()) {
        streak = 1;
        // Iterate backwards from the second most recent log
        for (let i = 0; i < logs.length - 1; i++) {
            const currentLogDate = new Date(logs[i].log_date);
            const nextLogDate = new Date(logs[i + 1].log_date);
            
            const expectedNextDate = new Date(currentLogDate);
            expectedNextDate.setDate(currentLogDate.getDate() - 1);

            if (nextLogDate.getTime() === expectedNextDate.getTime()) {
                streak++;
            } else {
                break; // Streak is broken
            }
        }
    }
    
    return streak;
};


/**
 * Fetches all profile data, including stats and achievements, for the logged-in user.
 */
export const getProfileData = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userName = req.user?.name;

    try {
        // 1. Get basic user info
        const userResult = await pool.query('SELECT email, created_at FROM users WHERE id = $1', [userId]);
        const user = { name: userName, ...userResult.rows[0] };

        // 2. Get all logs to calculate stats
        const logsResult = await pool.query('SELECT log_date FROM daily_logs WHERE user_id = $1 ORDER BY log_date DESC', [userId]);
        const logs = logsResult.rows;

        // 3. Get completed goals count
        const goalsResult = await pool.query("SELECT COUNT(*) FROM goals WHERE user_id = $1 AND status = 'completed'", [userId]);
        const goalsCompleted = parseInt(goalsResult.rows[0].count, 10);

        // 4. Calculate stats
        const stats = {
            totalLogs: logs.length,
            currentStreak: calculateStreak(logs),
            goalsCompleted: goalsCompleted,
            coinsEarned: 1247, // Placeholder for now
        };

        res.status(200).json({ user, stats });

    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ message: 'Server error while fetching profile data.' });
    }
};