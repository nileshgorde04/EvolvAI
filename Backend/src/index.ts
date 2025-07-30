import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { testDBConnection } from './config/db';
import authRoutes from './routes/authRoutes';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app: Express = express();
const port = process.env.PORT || 8080;

// --- Middlewares ---

// ** START: CORS Configuration Update **
// Configure CORS to specifically allow requests from your frontend
const corsOptions = {
  origin: 'http://localhost:3000', // The address of your frontend application
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
// ** END: CORS Configuration Update **

app.use(express.json());


// --- Routes ---
// Test route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the EvolvAI Backend! 🚀',
    status: 'Server is running healthy.'
  });
});

// Use the authentication routes for any requests to /api/auth
app.use('/api/auth', authRoutes);


// --- Server Activation ---
const startServer = async () => {
  await testDBConnection();

  app.listen(port, () => {
    console.log(`[server]: EvolvAI server is running at http://localhost:${port}`);
  });
};

// Start the server
startServer();
