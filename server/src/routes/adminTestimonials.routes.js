import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import {
  getPageSettings,
  updatePageSettings,
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialById,
} from '../controllers/admin/testimonial.controller.js';

const router = express.Router();

// Page Settings (Admin)
router.route('/settings')
  .get(getPageSettings)
  .put(updatePageSettings);

// Testimonial CRUD (Admin)
router.route('/')
  .get(getAllTestimonials)
  .post(upload.single('image'), createTestimonial);

router.route('/:id')
  .get(getTestimonialById)
  .patch(upload.single('image'), updateTestimonial)
  .delete(deleteTestimonial);

export default router;

