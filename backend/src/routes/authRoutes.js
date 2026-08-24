import express from 'express';
import { loginMember, getMe } from '../controllers/authController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', loginMember);

// GET /api/v1/auth/me (Protected)
router.get('/me', authGuard, getMe);

export default router;
