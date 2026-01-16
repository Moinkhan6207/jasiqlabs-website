import express from 'express';
import * as leadController from '../controllers/lead.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// =================================
// PUBLIC ROUTES (No authentication required)
// =================================

/**
 * @route   POST /api/leads/public
 * @desc    Create a new lead (public endpoint)
 * @access  Public
 */
router.post('/public', leadController.createLead);

// =================================
// PROTECTED ROUTES (Require authentication)
// =================================

// Apply authentication middleware to all routes below this line
router.use(protect);

/**
 * @route   GET /api/leads
 * @desc    Get all leads with optional filtering
 * @access  Private/Admin
 */
router.get('/', leadController.getAllLeads);

/**
 * @route   GET /api/leads/export
 * @desc    Export all leads as CSV
 * @access  Private/Admin
 */
router.get('/export', leadController.exportLeads);

export default router;
