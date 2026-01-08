import express from 'express';
import { getPageSeo } from '../controllers/publicPages.controller.js';

const router = express.Router();

// Page SEO
// Path: /api/public/pages/:slug/seo
router.get('/:slug/seo', getPageSeo);

export default router;