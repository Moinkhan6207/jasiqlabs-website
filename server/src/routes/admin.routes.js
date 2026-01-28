import express from 'express';
import { restrictTo } from '../middlewares/authMiddleware.js'; 
import {
  getDashboardStats,
  getRecentLeads,
} from '../controllers/admin/dashboard.controller.js';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/admin/blog.controller.js';
import {
  getJobOpenings,
  getJobOpening,
  createJobOpening,
  updateJobOpening,
  deleteJobOpening,
  toggleApplicationStatus,
  getJobApplications,
} from '../controllers/admin/career.controller.js';
import {
  getPageContents,
  updatePageContent,
} from '../controllers/admin/content.controller.js';
import {
  getDivisionContents,
  getDivisionContent,
  createDivisionContent,
  updateDivisionContent,
  deleteDivisionContent,
} from '../controllers/admin/division.controller.js';
import {
  getLeads,
  updateLeadStatus, // 👈 FIX 1: Ye Import Miss kar diya tha aapne
  exportLeadsToCSV,
} from '../controllers/admin/lead.controller.js';

const router = express.Router();

// Dashboard Routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-leads', getRecentLeads);

// Blog Routes
router.route('/blog')
  .get(getBlogPosts)
  .post(createBlogPost);

router.route('/blog/:id')
  .get(getBlogPost)
  .patch(updateBlogPost)
  .delete(deleteBlogPost);

// Career Routes
router.route('/careers')
  .get(getJobOpenings)
  .post(createJobOpening);

router.patch('/careers/:id/toggle-apply', toggleApplicationStatus);

// 👇 Admin: View Applications for a Job
router.get('/careers/:id/applications', getJobApplications);

router.route('/careers/:id')
  .get(getJobOpening)
  .patch(updateJobOpening)
  .delete(deleteJobOpening);

// Page Content Routes
router.route('/content/:pageName')
  .get(getPageContents)
  .patch(updatePageContent);

// Division Content Routes
router.route('/divisions/:type')
  .get(getDivisionContents)
  .post(createDivisionContent);

router.route('/divisions/:type/:id')
  .get(getDivisionContent)
  .patch(updateDivisionContent)
  .delete(deleteDivisionContent);

// Leads Management Routes
router.get('/leads', getLeads);
router.get('/leads/export', exportLeadsToCSV);
// 👇 FIX 2: Ye Route Add kiya (Status Update ke liye)
router.patch('/leads/:id/status', updateLeadStatus);

export default router;