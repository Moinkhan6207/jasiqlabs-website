import express from 'express';
import {
  getPrograms,
  getServices,
  getProducts,
  getProductById,
} from '../controllers/public/division.controller.js';
import { getSystemSettings } from '../controllers/admin/system.controller.js';

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

// Get a single product by ID
// Path: /api/public/products/:id
router.get('/products/:id', getProductById);

// Get system settings (public access)
// Path: /api/public/system-settings
router.get('/system-settings', getSystemSettings);

export default router;
