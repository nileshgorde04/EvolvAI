import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { testDBConnection } from './config/db'; // Import the test function

// Load environment variables from .env file
dotenv.config(); 

// Initialize the Express application
const app: Express = express();
const port = process.env.PORT || 8080;

// --- Middlewares ---
app.use(cors());
app.use(express.json()); 


// --- Routes ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the EvolvAI Backend! 🚀',
    status: 'Server is running healthy.'
  });
});


// --- Server Activation ---
const startServer = async () => {
  // First, test the database connection
  await testDBConnection();

  // If the database connection is successful, start the Express server
  app.listen(port, () => {
    console.log(`[server]: EvolvAI server is running at http://localhost:${port}`);
  });
};

// Start the server
startServer();
