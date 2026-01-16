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
  exportLeadsToCSV,
} from '../controllers/admin/lead.controller.js';
// Note: Config controller shayad abhi bana na ho, agar error aaye to ise comment kar dena
// import {
//   getGlobalConfigs,
//   updateGlobalConfig,
// } from '../controllers/admin/config.controller.js';

const router = express.Router();

// All routes in this file are already protected by the middleware in app.js
// No need to apply protect middleware here again

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

// Leads Management
router.get('/leads', getLeads);
router.get('/leads/export', exportLeadsToCSV);

// Global Config (Abhi ke liye comment kiya hai taaki crash na ho)
// router.route('/config')
//   .get(getGlobalConfigs);

// router.route('/config/:key')
//   .patch(updateGlobalConfig);

// 👇 Sabse Zaroori Line (Default Export)
export default router;