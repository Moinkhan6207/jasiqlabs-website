import express from 'express';
// Note: .js extension lagana zaroori hai
import { getSeoSettings, updateSeoSettings, getPageSeo, updatePageSeo } from '../controllers/admin/seo.controller.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to get SEO settings
router.get('/', getSeoSettings);

// Protected admin routes
// Humne yahan POST kar diya hai taaki Postman me asani ho
router.post('/', protect, admin, updateSeoSettings);

// Page-specific SEO routes
router.get('/:pageName', protect, admin, getPageSeo);
router.post('/:pageName', protect, admin, updatePageSeo);

export default router;