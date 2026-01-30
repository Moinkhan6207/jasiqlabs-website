import express from 'express';
import {
  getPrograms,
  getServices,
  getProducts,
} from '../controllers/public/division.controller.js';

const router = express.Router();

// Get all active programs
// Path: /api/public/programs
router.get('/programs', getPrograms);

// Get all active services
// Path: /api/public/services
router.get('/services', getServices);

// Get all products (MVP and Live status, excluding Research)
// Path: /api/public/products
router.get('/products', getProducts);

export default router;
