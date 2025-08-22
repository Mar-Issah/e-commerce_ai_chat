import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient } from 'mongodb';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGODB_URI || '');
const db = client.db('ecommerce_chat');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
