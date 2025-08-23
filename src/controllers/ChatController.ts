import { Request, Response } from 'express';

export class ChatController {
  // Start a new conversation
  async startConversation(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Generate unique thread ID
      const threadId = Date.now().toString();

      // Create new thread
      // await messageService.createThread(threadId);

      // Process the message with AI agent
      // const response = await agentService.callAgent(message, threadId);

      res.json({
        threadId,
        // response,
        message: 'Conversation started successfully',
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Continue existing conversation
  async continueConversation(req: Request, res: Response): Promise<void> {
    try {
      const { threadId } = req.params;
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Check if thread exists
      // const thread = await messageService.getThread(threadId);
      // if (!thread) {
      //   res.status(404).json({ error: 'Thread not found' });
      //   return;
      // }

      // Process the message with AI agent
      // const response = await agentService.callAgent(message, threadId);

      res.json({
        threadId,
        // response,
        message: 'Message processed successfully',
      });
    } catch (error) {
      console.error('Error continuing conversation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const chatController = new ChatController();
export default chatController;
