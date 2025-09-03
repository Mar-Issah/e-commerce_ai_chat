import { app } from './app';
import { database } from './config/database';

// Ensure DB is connected before handling requests
(async () => {
  try {
    await database.connect();
    console.log('✅ Database connected for Vercel');
  } catch (error) {
    console.error('❌ Failed to connect to database on Vercel:', error);
  }
})();

export default app; // Vercel needs this
