import express from 'express';
import { getPublishedBlogPosts, getPublishedBlogPost } from '../controllers/publicBlog.controller.js';

const router = express.Router();

// GET /api/public/blog - Get all published blog posts
router.get('/', getPublishedBlogPosts);

// GET /api/public/blog/:id - Get a single published blog post
router.get('/:id', getPublishedBlogPost);

export default router;
