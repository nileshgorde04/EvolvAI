import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { testDBConnection } from './config/db';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import journalRoutes from './routes/journalRoutes';
import goalsRoutes from './routes/goalsRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the EvolvAI Backend! 🚀' }));
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/logs', journalRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/profile', profileRoutes);

const startServer = async () => {
  await testDBConnection();
  app.listen(port, () => {
    console.log(`[server]: EvolvAI server is running at http://localhost:${port}`);
  });
};

startServer();