import { Request, Response } from 'express';

export class ChatController {
  // Start a new conversation
  async startConversation(req: Request, res: Response): Promise<void> {
      const {message} = req.body

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Generate unique thread ID using current timestamp
      const threadId = Date.now().toString()
      // Log the incoming message for debugging
      console.log(message)

      try {
        // Call our AI agent with the message and new thread ID
      //  const response = await callAgent(client, message, threadId)

        //res.json({ threadId, respons })
        res.json({ threadId })
      } catch (error) {

        console.error(error)

        res.status(500).json({ error: 'Internal server error' })
      }
  }

  // Continue existing conversation
  async continueConversation(req: Request, res: Response): Promise<void> {
       // Extract thread ID from URL parameters
      const { threadId } = req.params
      // Extract user message from request body
      const { message } = req.body
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }
      try {
        // Call AI agent with message and existing thread ID (continues conversation)
       // const response = await callAgent(client, message, threadId)
         // const response = await agentService.callAgent(message, threadId);
        // Send AI response (no need to send threadId again since it's continuing)
        console.log(threadId)
        res.json({ response:"siya" })
      } catch (error) {
        // Log any errors that occur during agent execution
        console.error('Error in chat:', error)
        // Send error response with 500 status code
        res.status(500).json({ error: 'Internal server error' })
      }
  }
}

export const chatController = new ChatController();
export default chatController;
