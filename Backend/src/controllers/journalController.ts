import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- (The existing createOrUpdateLog and getLogsForUser functions remain here) ---
// ...
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

    const values = [
      userId, 
      log_date, 
      content, 
      mood, 
      productivity_score, 
      sleep_hours, 
      water_intake, 
      screen_time_hours,
      emotional_tags
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error in createOrUpdateLog:', error);
    res.status(500).json({ message: 'Server error while saving journal log.' });
  }
};

export const getLogsForUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const result = await pool.query(
      'SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY log_date DESC', 
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in getLogsForUser:', error);
    res.status(500).json({ message: 'Server error while fetching journal logs.' });
  }
};


// --- analyzeLog function with the fix ---
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
            You are EvolvAI, a deeply empathetic and caring AI companion. Your role is to act like a supportive friend or mother, listening to the user's day and offering gentle, insightful feedback. The user's name is ${userName}.

            Today, they shared the following:
            - Mood: ${mood}/5 (${moodMap[mood] || 'N/A'})
            - Productivity: ${productivity_score}/10
            - Emotional Tags: ${emotional_tags.join(', ')}
            - Journal Entry: "${content}"

            Based ONLY on the information provided, please analyze their day and respond in a warm, encouraging tone. Your response MUST be a valid JSON object with the following structure and nothing else:
            {
              "moodAnalysis": "A gentle analysis of their mood and feelings based on their text and tags.",
              "positiveReinforcement": "Find something positive, no matter how small, and praise them for it. Be specific.",
              "gentleSuggestion": "Offer one small, actionable piece of advice that could help them tomorrow. Frame it as a caring suggestion, not a command."
            }
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // --- START: THE FIX ---
        // Clean the response text to ensure it's valid JSON
        // This removes the Markdown code block syntax (```json ... ```) if it exists
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            responseText = jsonMatch[1];
        }
        // --- END: THE FIX ---

        const analysis = JSON.parse(responseText);

        // Save the analysis to the database
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