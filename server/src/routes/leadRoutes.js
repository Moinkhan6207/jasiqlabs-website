import express from 'express';
import rateLimit from 'express-rate-limit';
// Sirf createLead import karein
import { createLead } from '../controllers/admin/lead.controller.js';

const router = express.Router();

// Rate limiting configuration - 5 requests per 15 minutes per IP
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { 
    success: false, 
    message: 'Too many lead submissions from this IP, please try again after 15 minutes' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// ====================================================
// PUBLIC ROUTE (Contact Form)
// URL: POST /api/public/leads
// ====================================================
router.post('/', leadLimiter, createLead);

// NOTE: getLeads aur exportLeads yahan se hata diye hain 
// kyunki wo 'admin.routes.js' mein already hain.

export default router;