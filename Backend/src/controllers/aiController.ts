import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuthRequest } from '../middleware/authMiddleware'; // We need the AuthRequest type again

// Initialize the Google Generative AI client with the API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Handles chat requests from the user.
 * @param req - The authenticated Express request object, with user data.
 * @param res - The Express response object.
 */
export const handleChat = async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  // Get the user's name from the token payload provided by the 'protect' middleware
  const userName = req.user?.name || 'User'; 

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    // For this example, we will use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // The prompt is now personalized with the user's actual name
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
    res.status(500).json({ message: 'Error communicating with the AI model.' });
  }
};