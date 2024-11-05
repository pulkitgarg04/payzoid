import express from 'express';
import { getChatHistory } from '../controllers/message.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/history/:user1Id/:user2Id', authMiddleware, getChatHistory);

export default router;