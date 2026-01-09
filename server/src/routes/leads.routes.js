import express from 'express';
import { createLead } from '../controllers/lead.controller.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

// Apply rate limiting to lead submission
router.post('/', rateLimit, createLead);

export default router;












