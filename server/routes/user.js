import express from 'express';
import {
  filterUsers,
  signin,
  signup,
  getUser,
  updateUser,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/getuser/', getUser);

router.put('/', authMiddleware, updateUser);

router.get('/bulk', filterUsers);

export default router;