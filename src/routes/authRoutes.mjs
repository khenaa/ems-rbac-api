import express from 'express';
import {
  login,
  register,
  updatePassword,
} from '../controllers/authController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';
import { restrictedTo } from '../middlewares/restrictedTo.mjs';

const router = express.Router();

router.post('/register', authMiddleware, restrictedTo('Admin'), register);

router.post('/login', login);

router.patch('/update-password', authMiddleware, updatePassword);

export default router;
