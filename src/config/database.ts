import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables');
}

class Database {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI as string);
  }

  async connect(): Promise<MongoClient> {
    try {
      await this.client.connect();
      this.db = this.client.db();
      //await this.db.command({ ping: 1 });
      console.log('✅ Successfully connected to MongoDB!');

      // Returns a reference to the client to reuse later
      return this.client;
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error);
      throw error;
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
  // Reuse this for other operations
  getClient(): MongoClient {
    return this.client;
  }
  async close(): Promise<void> {
    await this.client.close();
  }
}

export const database = new Database();
export default database;
