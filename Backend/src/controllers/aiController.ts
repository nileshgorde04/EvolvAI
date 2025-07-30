import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuthRequest } from '../middleware/authMiddleware';

let genAI: GoogleGenerativeAI;

try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error);
}

// Helper function for retrying with exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Handles chat requests from the user.
 * @param req - The authenticated Express request object, with user data.
 * @param res - The Express response object.
 */
export const handleChat = async (req: AuthRequest, res: Response) => {
  if (!genAI) {
    return res.status(500).json({ message: 'AI service is not configured correctly on the server.' });
  }

  const { message } = req.body;
  const userName = req.user?.name || 'User';

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  let retries = 3;
  let delay = 1000; // Start with a 1-second delay

  while (retries > 0) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        // ... (the rest of the function stays the same)
        
        const prompt = `You are EvolvAI, a helpful and encouraging personal development assistant. 
        The user you are talking to is named ${userName}. 
        Based on their question, provide a supportive and insightful response.
        User's question: "${message}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ reply: text });

    } catch (error: any) {
      // Check if the error is a 503 Service Unavailable
      if (error.status === 503 && retries > 1) {
        console.log(`[AI Controller]: Model is overloaded. Retrying in ${delay / 1000}s... (${retries - 1} retries left)`);
        await sleep(delay);
        retries--;
        delay *= 2; // Double the delay for the next retry
      } else {
        // If it's a different error or we're out of retries, fail
        console.error('Error communicating with Gemini API:', error);
        return res.status(500).json({ message: 'An error occurred while communicating with the AI model.' });
      }
    }
  }
};