import express from 'express';
import * as leadController from '../controllers/leadController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/', leadController.createLead);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', leadController.getAllLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/export', leadController.exportLeads);

export default router;
