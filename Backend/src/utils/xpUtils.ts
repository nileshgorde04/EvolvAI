import pool from '../config/db';

export const XP_REWARDS = {
    DAILY_LOG: 15,
    STREAK_BONUS_PER_DAY: 5,
    TASK_COMPLETED: 25,
    GOAL_COMPLETED: 150,
    POSITIVE_MOOD: 10,
};

// XP thresholds for each level
const LEVEL_THRESHOLDS = [0, 150, 300, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000]; // Level 1 to 10

/**
 * Awards XP to a user and handles level ups.
 * @param userId The ID of the user to award XP to.
 * @param xpAmount The amount of XP to award.
 */
export const awardXp = async (userId: string, xpAmount: number) => {
    try {
        const userResult = await pool.query('SELECT xp, level FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) return;

        let { xp: currentXp, level: currentLevel } = userResult.rows[0];
        const newXp = currentXp + xpAmount;
        
        let newLevel = currentLevel;
        // Check if the user has enough XP to level up
        if (currentLevel < LEVEL_THRESHOLDS.length && newXp >= LEVEL_THRESHOLDS[currentLevel]) {
            newLevel++;
        }

        await pool.query('UPDATE users SET xp = $1, level = $2 WHERE id = $3', [newXp, newLevel, userId]);
        
    } catch (error) {
        console.error("Failed to award XP:", error);
    }
};

/**
 * Calculates the XP needed for the next level.
 * @param currentLevel The user's current level.
 * @returns The total XP required to reach the next level.
 */
export const getXpForNextLevel = (currentLevel: number): number => {
    if (currentLevel >= LEVEL_THRESHOLDS.length) {
        return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]; // Max level
    }
    return LEVEL_THRESHOLDS[currentLevel];
};