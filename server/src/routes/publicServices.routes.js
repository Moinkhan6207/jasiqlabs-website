import express from 'express';
import {
  getServiceBySlug,
  getAllServices,
  getAllPrograms,
  getAllProducts,
} from '../controllers/publicServices.controller.js';

const router = express.Router();

// Get all active services
// Path: /api/public/services
router.get('/services', getAllServices);

// Get service by slug
// Path: /api/public/services/:slug
router.get('/services/:slug', getServiceBySlug);

// Get all active programs
// Path: /api/public/programs
router.get('/programs', getAllPrograms);

// Get all active products
// Path: /api/public/products
router.get('/products', getAllProducts);

export default router;
