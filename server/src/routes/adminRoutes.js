import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import adminRouter from './admin.routes.js';

const router = express.Router();

// Public routes
router.post('/login', authController.login);

// Protect all routes after this middleware
router.use(protect);

// Admin dashboard and management routes
router.use('/cms', restrictTo('admin'), adminRouter);

// Get current admin
router.get('/me', authController.getMe);

// Update password
router.patch('/updateMyPassword', authController.updatePassword);

export default router;
