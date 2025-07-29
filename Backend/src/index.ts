import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app: Express = express();
const port = process.env.PORT || 8080; // Use port from .env or default to 8080

// --- Middlewares ---nettat
// Enable Cross-Origin Resource Sharing (CORS) to allow our frontend to communicate with this backend
app.use(cors());

// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());


// --- Routes ---
// A simple test route to check if the server is running
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the EvolvAI Backend! 🚀',
    status: 'Server is running healthy.'
  });
});


// --- Server Activation ---
// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`[server]: EvolvAI server is running at http://localhost:${port}`);
});
