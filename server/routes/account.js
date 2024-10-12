import express from 'express';
import { balance, transfer, getLatestTransactions } from '../controllers/account.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/balance', authMiddleware, balance);

router.post('/transfer', authMiddleware, transfer);
router.get('/transactions', authMiddleware, getLatestTransactions);
export default router;