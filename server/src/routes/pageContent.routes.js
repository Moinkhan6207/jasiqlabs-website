import express from 'express';
// 👇 Note: Import me '.js' lagana zaroori hai
import { protect, admin } from '../middlewares/authMiddleware.js';
import { getPageContent, upsertPageContent } from '../controllers/admin/pageContent.controller.js';

const router = express.Router();

// Public routes (Get Content)
router.get('/:pageName/:sectionKey', getPageContent);

// Protected Admin routes (Update Content)
// Sirf Admin hi content change kar sakta hai
router.post('/', protect, admin, upsertPageContent);

// 👇 Ye sabse important line hai jo error fix karegi
export default router;