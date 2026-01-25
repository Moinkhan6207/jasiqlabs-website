import express from 'express';
// Sirf createLead import karein
import { createLead } from '../controllers/admin/lead.controller.js';

const router = express.Router();

// ====================================================
// PUBLIC ROUTE (Contact Form)
// URL: POST /api/public/leads
// ====================================================
router.post('/', createLead);

// NOTE: getLeads aur exportLeads yahan se hata diye hain 
// kyunki wo 'admin.routes.js' mein already hain.

export default router;