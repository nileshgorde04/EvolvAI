import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { testDBConnection } from './config/db';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes'; // Make sure this line exists
import journalRoutes from './routes/journalRoutes';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app: Express = express();
const port = process.env.PORT || 8080;

// --- Middlewares ---
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());



// --- Routes ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the EvolvAI Backend! 🚀',
    status: 'Server is running healthy.'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes); // And make sure this line exists
app.use('/api/logs', journalRoutes);


// --- Server Activation ---
const startServer = async () => {
  await testDBConnection();

  app.listen(port, () => {
    console.log(`[server]: EvolvAI server is running at http://localhost:${port}`);
  });
};

// Start the server
startServer();