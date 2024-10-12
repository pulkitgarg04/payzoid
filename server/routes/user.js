import express from 'express';
import {
  filterUsers,
  signin,
  signup,
  getUser,
  getRecipentant,
  updateUser,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/getUserData', authMiddleware, getUser);
router.get('/getRecipentant/:id', getRecipentant);

router.put('/', authMiddleware, updateUser);

router.get('/bulk', filterUsers);

export default router;