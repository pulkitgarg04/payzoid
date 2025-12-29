import express from 'express';
import { sendMessage, getConversation } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:userId1/:userId2', getConversation);

export default router;