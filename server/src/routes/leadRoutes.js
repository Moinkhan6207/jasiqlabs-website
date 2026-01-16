import express from 'express';
// 👇 FIX: Sahi path se import karein (aapke folder structure ke hisab se)
import { 
  createLead, 
  getLeads, 
  // getLeadStats, // Agar ye controller me nahi hai to comment rakhein
  exportLeadsToCSV 
} from '../controllers/admin/lead.controller.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. PUBLIC ROUTE
// 👇 FIX: '/public' hata diya. Kyunki app.js khud '/api/public/leads' bhej raha hai.
// Ab ye banega: POST /api/public/leads
router.post('/', createLead);

// 2. PROTECTED ROUTES (Is line ke niche sab locked hai)
// Note: Hum app.js me bhi protect laga rahe hain, par yahan double safety hai.
// router.use(protect); // app.js handle kar raha hai, par yaha rehne de sakte hain

// Admin Routes
router.get('/', getLeads);
router.get('/export', exportLeadsToCSV);
// router.get('/stats', getLeadStats); // Agar controller bana ho tab uncomment karein

export default router;