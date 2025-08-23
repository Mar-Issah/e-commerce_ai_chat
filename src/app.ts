import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', chatRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'LangGraph Agent Server',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

export { app, port };
