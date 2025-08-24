import { ObjectId } from 'mongodb';

// Since we are using MongoDB driver + TypeScript to connect to db, we are using TypeScript interfaces (or types) — to define the shape of documents

//Combine with Zdd for runtime validation
export interface IMessage {
  _id?: ObjectId;
  threadId: string;
  message: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface IThread {
  _id?: ObjectId;
  threadId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}
