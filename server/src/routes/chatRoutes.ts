import { Router } from 'express';
import chatController from '../controllers/ChatController';

const router = Router();

// Start new conversation
router.post('/chat', chatController.startConversation);

// Continue existing conversation
router.post('/chat/:threadId', chatController.continueConversation);

export default router;
