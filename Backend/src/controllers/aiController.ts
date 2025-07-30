import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuthRequest } from '../middleware/authMiddleware';

// It's safer to initialize this inside the try block to catch key errors
let genAI: GoogleGenerativeAI;

try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error);
}


/**
 * Handles chat requests from the user.
 * @param req - The authenticated Express request object, with user data.
 * @param res - The Express response object.
 */
export const handleChat = async (req: AuthRequest, res: Response) => {
  // Check if genAI was initialized successfully
  if (!genAI) {
    return res.status(500).json({ message: 'AI service is not configured correctly on the server.' });
  }

  const { message } = req.body;
  const userName = req.user?.name || 'User';

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are EvolvAI, a helpful and encouraging personal development assistant. 
    The user you are talking to is named ${userName}. 
    Based on their question, provide a supportive and insightful response.
    User's question: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    // Ensure a JSON error response is always sent
    res.status(500).json({ message: 'An error occurred while communicating with the AI model.' });
  }
};