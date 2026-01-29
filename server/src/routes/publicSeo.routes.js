import express from 'express';
import { getSeoDefaults, getPageSeo } from '../controllers/publicSeo.controller.js';

const router = express.Router();

// Path: /api/public/seo/defaults
// Note: Yahan sirf '/' ya '/defaults' likhenge kyunki '/api/public/seo' app.js mein hai
router.get('/defaults', getSeoDefaults);

// Path: /api/public/seo/:pageName
// Get SEO data for a specific page
router.get('/:pageName', getPageSeo);

// Named Export use kar rahe hain (bracket wala)
export const publicSeoRouter = router;

export default router;