import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Calculates the user's current consecutive day streak from their logs.
 * This is the "real" streak logic, identical to the one on the profile page.
 * @param logs - An array of log objects with a `log_date` property, sorted descending.
 * @returns The number of consecutive days in the streak.
 */
const calculateStreak = (logs: { log_date: Date }[]): number => {
    if (logs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const mostRecentLogDate = new Date(logs[0].log_date);
    mostRecentLogDate.setHours(0, 0, 0, 0);

    // A streak can only start if the last log was today or yesterday.
    if (mostRecentLogDate.getTime() === today.getTime() || mostRecentLogDate.getTime() === yesterday.getTime()) {
        streak = 1;
        // Iterate backwards from the second most recent log
        for (let i = 0; i < logs.length - 1; i++) {
            const currentLogDate = new Date(logs[i].log_date);
            const nextLogDate = new Date(logs[i + 1].log_date);
            
            const expectedPreviousDate = new Date(currentLogDate);
            expectedPreviousDate.setDate(currentLogDate.getDate() - 1);

            if (nextLogDate.getTime() === expectedPreviousDate.getTime()) {
                streak++;
            } else {
                break; // The streak is broken
            }
        }
    }
    
    return streak;
};

/**
 * Fetches aggregated data needed for the main user dashboard.
 */
export const getDashboardData = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userName = req.user?.name;

    try {
        // Fetch last 7 days of logs for charts
        const recentLogsResult = await pool.query(`
            SELECT log_date, mood, productivity_score 
            FROM daily_logs 
            WHERE user_id = $1 AND log_date >= current_date - interval '7 days'
            ORDER BY log_date ASC
        `, [userId]);
        
        // Fetch user stats
        const userStatsResult = await pool.query('SELECT xp FROM users WHERE id = $1', [userId]);
        
        // Fetch all logs to calculate the streak
        const allLogsResult = await pool.query('SELECT log_date FROM daily_logs WHERE user_id = $1 ORDER BY log_date DESC', [userId]);

        // Fetch the most recent goal and its tasks
        const goalResult = await pool.query(`
            SELECT g.id, g.title, t.id as task_id, t.is_completed 
            FROM goals g
            LEFT JOIN tasks t ON g.id = t.goal_id
            WHERE g.user_id = $1
            ORDER BY g.created_at DESC
            LIMIT 1
        `, [userId]);

        // --- Safely process all fetched data ---

        let mainGoal = null;
        if (goalResult.rows.length > 0) {
            const goalRow = goalResult.rows[0];
            const allTasksForGoal = goalResult.rows.map(r => ({ id: r.task_id, is_completed: r.is_completed })).filter(t => t.id != null);
            const completedTasks = allTasksForGoal.filter(t => t.is_completed).length;
            const progress = allTasksForGoal.length > 0 ? Math.round((completedTasks / allTasksForGoal.length) * 100) : 0;
            
            mainGoal = {
                title: goalRow.title,
                progress: progress,
                tasksCompleted: completedTasks,
                totalTasks: allTasksForGoal.length
            };
        }

        const dashboardData = {
            userName,
            recentLogs: recentLogsResult.rows,
            coinsEarned: userStatsResult.rows[0]?.xp || 0,
            allLogs: allLogsResult.rows,
            mainGoal,
            currentStreak: calculateStreak(allLogsResult.rows), // Use the real streak logic
        };

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error while fetching dashboard data.' });
    }
};