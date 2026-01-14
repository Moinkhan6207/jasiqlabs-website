import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js'; // .js lagana zaroori hai
const router = express.Router();

// Public routes
router.post('/login', authController.login);

// Protected routes
router.use(protect);
// Get current admin
router.get('/me', authController.getMe);

// Update password
router.patch('/updateMyPassword', authController.updatePassword);

export default router;
