import { prisma } from '../db/prisma.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Get all published blog posts for public viewing
 */
export const getPublishedBlogPosts = catchAsync(async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blogPost.count({ 
      where: {
        published: true
      }
    }),
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
 * Get a single published blog post by slug or ID
 */
export const getPublishedBlogPost = catchAsync(async (req, res, next) => {
  const { id } = req.params; 

  const isUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(id);

  let post;

  if (isUuid) {
    post = await prisma.blogPost.findFirst({ 
      where: { 
        id,
        published: true 
      }
    });
  } else {
    post = await prisma.blogPost.findFirst({ 
      where: { 
        slug: id,
        published: true 
      }
    });
  }

  if (!post) {
    return next(new AppError('No published blog post found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post,
    },
  });
});
