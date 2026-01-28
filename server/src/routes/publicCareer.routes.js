import express from 'express';
// 👇 Import 'applyForJob' function
import { getPublicJobs, applyForJob } from '../controllers/admin/career.controller.js';

const router = express.Router();

// 1. Get All Public Jobs (Jo Published hain)
router.get('/', getPublicJobs);

// 2. 👇 NEW: Apply Route
// URL: POST /api/public/careers/:jobId/apply
router.post('/:jobId/apply', applyForJob);

export default router;