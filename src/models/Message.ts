import { ObjectId } from 'mongodb';

export interface IMessage {
  _id?: ObjectId;
  threadId: string;
  message: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    userId?: string;
    sessionId?: string;
    [key: string]: any;
  };
}

export interface IThread {
  _id?: ObjectId;
  threadId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  status: 'active' | 'closed' | 'archived';
  metadata?: {
    userId?: string;
    sessionId?: string;
    [key: string]: any;
  };
}
