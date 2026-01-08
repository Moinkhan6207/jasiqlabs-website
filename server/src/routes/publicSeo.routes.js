import express from 'express';
import { getSeoDefaults } from '../controllers/publicSeo.controller.js';

const router = express.Router();

// Path: /api/public/seo/defaults
// Note: Yahan sirf '/' ya '/defaults' likhenge kyunki '/api/public/seo' app.js mein hai
router.get('/defaults', getSeoDefaults);

// Named Export use kar rahe hain (bracket wala)
export const publicSeoRouter = router;

export default router;