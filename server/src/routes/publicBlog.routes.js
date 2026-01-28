import express from 'express';
import { getBlogPosts, getBlogPost } from '../controllers/admin/blog.controller.js';

const router = express.Router();

// GET /api/public/blog - Get all published blog posts
router.get('/', getBlogPosts);

// GET /api/public/blog/:id - Get a single published blog post
router.get('/:id', getBlogPost);

export default router;
