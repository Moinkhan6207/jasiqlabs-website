import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import slugify from 'slugify';

const prisma = new PrismaClient();

/**
 * Get all blog posts
 * @route GET /api/admin-cms/blog
 * @access Private/Admin
 */
export const getBlogPosts = catchAsync(async (req, res, next) => {
  const { published, limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  
  const where = {};
  if (published === 'true') where.published = true;
  if (published === 'false') where.published = false;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blogPost.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    total,
    data: {
      posts,
    },
  });
});

/**
 * Get a single blog post
 * @route GET /api/admin-cms/blog/:id
 * @access Private/Admin
 */
export const getBlogPost = catchAsync(async (req, res, next) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    return next(new AppError('No blog post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});

/**
 * Create a new blog post
 * @route POST /api/admin-cms/blog
 * @access Private/Admin
 */
export const createBlogPost = catchAsync(async (req, res, next) => {
  const { title, summary, content, coverImage, metaTitle, metaDesc } = req.body;
  
  const slug = slugify(title, { lower: true, strict: true });
  
  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      summary,
      content,
      coverImage: coverImage || null,
      author: req.user.name || 'Admin',
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || summary.substring(0, 160),
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      post,
    },
  });
});

/**
 * Update a blog post
 * @route PATCH /api/admin-cms/blog/:id
 * @access Private/Admin
 */
export const updateBlogPost = catchAsync(async (req, res, next) => {
  const { title, summary, content, coverImage, published, metaTitle, metaDesc } = req.body;
  
  const updateData = { ...req.body };
  
  if (title) {
    updateData.slug = slugify(title, { lower: true, strict: true });
  }
  
  // Handle publish action
  if (published === true) {
    updateData.published = true;
    updateData.publishedAt = new Date();
  } else if (published === false) {
    updateData.published = false;
    updateData.publishedAt = null;
  }

  const updatedPost = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: 'success',
    data: {
      post: updatedPost,
    },
  });
});

/**
 * Delete a blog post
 * @route DELETE /api/admin-cms/blog/:id
 * @access Private/Admin
 */
export const deleteBlogPost = catchAsync(async (req, res, next) => {
  await prisma.blogPost.delete({
    where: { id: req.params.id },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
