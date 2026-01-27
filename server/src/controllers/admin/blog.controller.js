import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import slugify from 'slugify';
import logger from '../../utils/logger.js';

const prisma = new PrismaClient();

/**
 * Get all blog posts
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
 */
export const getBlogPost = catchAsync(async (req, res, next) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    logger.warn('Blog post not found', {
      event: 'BLOG_NOT_FOUND',
      blogId: req.params.id,
      correlationId: req.correlationId,
      ip: req.ip
    });
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
 */
export const createBlogPost = catchAsync(async (req, res, next) => {
  const { title, summary, content, coverImage, metaTitle, metaDesc, category, author, tags, isFeatured } = req.body;
  
  const slug = slugify(title, { lower: true, strict: true });
  
  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      summary,
      content,
      coverImage: coverImage || null,
      author: author || 'Admin',
      category: category || 'Tech',
      tags: tags || [],
      isFeatured: isFeatured || false,
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || summary.substring(0, 160),
    },
  });

  logger.info('New Blog Created Successfully', {
    event: 'BLOG_CREATED',
    blogId: post.id,
    title: title,
    author: req.user.name,
    userId: req.user.id,
    correlationId: req.correlationId
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
 */
export const updateBlogPost = catchAsync(async (req, res, next) => {
  // 👇 FIX: Yahan 'published' add kar diya hai (Yehi missing tha aapke purane code mein)
  const { title, published } = req.body;
  
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

  logger.info('Blog Post Updated', {
    event: 'BLOG_UPDATED',
    blogId: req.params.id,
    title: updatedPost.title,
    isPublished: updatedPost.published,
    userId: req.user.id,
    correlationId: req.correlationId
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
 */
export const deleteBlogPost = catchAsync(async (req, res, next) => {
  const deletedPost = await prisma.blogPost.delete({
    where: { id: req.params.id },
  });

  logger.info('Blog Post Deleted', {
    event: 'BLOG_DELETED',
    blogId: req.params.id,
    title: deletedPost.title,
    userId: req.user.id,
    correlationId: req.correlationId
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});