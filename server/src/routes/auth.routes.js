import express from 'express';
// 👇 Sahi jagah se import karein (Controller se)
import { login, getMe, logout } from '../controllers/admin/auth.controller.js';
// 👇 Middleware se sirf 'protect' layein
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/login', login);
router.post('/logout', logout);

// Protected Routes
router.get('/me', protect, getMe);

export default router;