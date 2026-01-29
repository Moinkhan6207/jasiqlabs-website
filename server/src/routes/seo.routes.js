import express from 'express';
// Note: .js extension lagana zaroori hai
import { getSeoSettings, updateSeoSettings } from '../controllers/admin/seo.controller.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to get SEO settings
router.get('/', getSeoSettings);

// Protected admin routes
// Humne yahan POST kar diya hai taaki Postman me asani ho
router.post('/', protect, admin, updateSeoSettings);

export default router;