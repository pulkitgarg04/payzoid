import express from 'express';
import {
  login,
  signup,
  verifyEmail,
  // forgotPassword,
  // resetPassword,
  checkAuth,

  getUser,
  getUserLogs,
  filterUsers,
  getRecipentant,
  updateUser,
} from '../controllers/user.controller.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/check-auth', authMiddleware, checkAuth);

router.post('/signup', signup);
router.post('/login', login);

router.post("/verify-email", verifyEmail);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

router.get('/getUserData', authMiddleware, getUser);
router.get('/getRecipentant/:id', getRecipentant);

router.get('/getUserLogs', authMiddleware, getUserLogs);

router.put('/update', authMiddleware, updateUser);

router.get('/bulk', filterUsers);

export default router;