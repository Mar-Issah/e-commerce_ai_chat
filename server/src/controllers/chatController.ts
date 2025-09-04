import { Request, Response } from 'express';
import { callAgent } from '../services/agent';
import database from '../config/database';

export class ChatController {
  async getAllItems(req: Request, res: Response): Promise<void> {
    // When deploying in a persistent server env
    // const = database.getDb()
    const db = await database.connect();
    try {
      const items = await db
        .collection('items')
        .find(
          {},
          {
            projection: {
              _id: 0,
              item_id: 1,
              item_name: 1,
              item_description: 1,
              brand: 1,
              manufacturer_address: 1,
              prices: 1,
              categories: 1,
              user_reviews: 1,
              notes: 1,
              image: 1,
            },
          }
        )
        .toArray();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Start a new conversation
  async startConversation(req: Request, res: Response): Promise<void> {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Generate unique thread ID using current timestamp
    const threadId = Date.now().toString();
    // Log the incoming message for debugging
    console.log(message);

    try {
      // Call our AI agent with the message and new thread ID
      const response = await callAgent(message, threadId);

      res.json({ threadId, response });
      //res.json({ threadId })
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Continue existing conversation
  async continueConversation(req: Request, res: Response): Promise<void> {
    // Extract thread ID from URL parameters
    const { threadId } = req.params;
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    try {
      const response = await callAgent(message, threadId);
      // Send AI response (no need to send threadId again since it's continuing)
      res.json({ response });
    } catch (error) {
      // Log any errors that occur during agent execution
      console.error('Error in chat:', error);
      // Send error response with 500 status code
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const chatController = new ChatController();
export default chatController;
