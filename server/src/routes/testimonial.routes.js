import express from 'express';
import {
  getPageSettings,
  getPublicTestimonials
} from '../controllers/admin/testimonial.controller.js';

const router = express.Router();

// Public Routes (No auth required) - mounted at /api/public/testimonials
router.get('/', getPublicTestimonials);
router.get('/settings', getPageSettings);

export default router;
