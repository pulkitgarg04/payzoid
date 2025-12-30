import express from 'express';
import { sendMessage, getConversation } from '../controllers/message.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/:userId1/:userId2', authMiddleware, getConversation);

export default router;