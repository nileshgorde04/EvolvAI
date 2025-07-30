import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { getXpForNextLevel } from '../utils/xpUtils';

const calculateStreak = (logs: { log_date: Date }[]): number => {
    if (logs.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const mostRecentLogDate = new Date(logs[0].log_date);
    if (mostRecentLogDate.getTime() === today.getTime() || mostRecentLogDate.getTime() === yesterday.getTime()) {
        streak = 1;
        for (let i = 0; i < logs.length - 1; i++) {
            const currentLogDate = new Date(logs[i].log_date);
            const nextLogDate = new Date(logs[i + 1].log_date);
            const expectedNextDate = new Date(currentLogDate);
            expectedNextDate.setDate(currentLogDate.getDate() - 1);
            if (nextLogDate.getTime() === expectedNextDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }
    }
    return streak;
};

export const getProfileData = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userName = req.user?.name;
    try {
        const userResult = await pool.query('SELECT email, created_at, xp, level, profile_picture_url FROM users WHERE id = $1', [userId]);
        const user = { name: userName, ...userResult.rows[0] };

        const logsResult = await pool.query('SELECT log_date FROM daily_logs WHERE user_id = $1 ORDER BY log_date DESC', [userId]);
        const logs = logsResult.rows;

        const goalsResult = await pool.query("SELECT COUNT(*) FROM goals WHERE user_id = $1 AND status = 'completed'", [userId]);
        const goalsCompleted = parseInt(goalsResult.rows[0].count, 10);

        const stats = {
            totalLogs: logs.length,
            currentStreak: calculateStreak(logs),
            goalsCompleted: goalsCompleted,
            coinsEarned: user.xp,
        };
        
        const levelInfo = {
            level: user.level,
            xp: user.xp,
            xpForNextLevel: getXpForNextLevel(user.level)
        };

        res.status(200).json({ user, stats, levelInfo });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ message: 'Server error while fetching profile data.' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { name, profile_picture_url } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE users SET name = COALESCE($1, name), profile_picture_url = COALESCE($2, profile_picture_url) WHERE id = $3 RETURNING id, name, email, profile_picture_url',
            [name, profile_picture_url, userId]
        );
        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};