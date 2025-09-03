import { app, port } from './app';
import { database } from './config/database';

async function startServer() {
  try {
    // Connect to MongoDB
    await database.connect();

    // Start the Express server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startServer();
