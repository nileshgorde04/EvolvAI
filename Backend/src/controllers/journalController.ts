import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { awardXp, XP_REWARDS } from '../utils/xpUtils'; // Import XP utils

export const createOrUpdateLog = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { 
    log_date,
    content, 
    mood, 
    productivity_score, 
    sleep_hours, 
    water_intake, 
    screen_time_hours,
    emotional_tags 
  } = req.body;

  if (!log_date) {
    return res.status(400).json({ message: 'Log date is required.' });
  }

  try {
    const existingLog = await pool.query('SELECT id FROM daily_logs WHERE user_id = $1 AND log_date = $2', [userId, log_date]);
    const isNewLog = existingLog.rows.length === 0;

    const query = `
      INSERT INTO daily_logs (user_id, log_date, content, mood, productivity_score, sleep_hours, water_intake, screen_time_hours, emotional_tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id, log_date)
      DO UPDATE SET
        content = EXCLUDED.content,
        mood = EXCLUDED.mood,
        productivity_score = EXCLUDED.productivity_score,
        sleep_hours = EXCLUDED.sleep_hours,
        water_intake = EXCLUDED.water_intake,
        screen_time_hours = EXCLUDED.screen_time_hours,
        emotional_tags = EXCLUDED.emotional_tags,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [userId, log_date, content, mood, productivity_score, sleep_hours, water_intake, screen_time_hours, emotional_tags];
    const result = await pool.query(query, values);

    if (isNewLog && userId) {
        let xpToAward = XP_REWARDS.DAILY_LOG;
        if (mood >= 4) {
            xpToAward += XP_REWARDS.POSITIVE_MOOD;
        }
        await awardXp(userId, xpToAward);
    }

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error in createOrUpdateLog:', error);
    res.status(500).json({ message: 'Server error while saving journal log.' });
  }
};

export const getLogsForUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const result = await pool.query('SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY log_date DESC', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in getLogsForUser:', error);
    res.status(500).json({ message: 'Server error while fetching journal logs.' });
  }
};

// ... (The analyzeLog function remains the same)
let genAI: GoogleGenerativeAI;
try {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found.");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (e) { console.error(e); }

export const analyzeLog = async (req: AuthRequest, res: Response) => {
    if (!genAI) return res.status(500).json({ message: 'AI service not configured.' });
    const userId = req.user?.id;
    const userName = req.user?.name || 'there';
    const { log_date, content, mood, productivity_score, emotional_tags } = req.body;
    const moodMap: { [key: number]: string } = { 1: "Very Sad", 2: "Sad", 3: "Neutral", 4: "Happy", 5: "Very Happy" };
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
            You are EvolvAI, a deeply empathetic and caring AI companion...
            {
              "moodAnalysis": "...",
              "positiveReinforcement": "...",
              "gentleSuggestion": "..."
            }
        `;
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            responseText = jsonMatch[1];
        }
        const analysis = JSON.parse(responseText);
        await pool.query(
            'UPDATE daily_logs SET ai_analysis = $1 WHERE user_id = $2 AND log_date = $3',
            [analysis, userId, log_date]
        );
        res.status(200).json({ analysis });
    } catch (error) {
        console.error("Error during AI analysis:", error);
        res.status(500).json({ message: "Failed to get AI analysis." });
    }
};