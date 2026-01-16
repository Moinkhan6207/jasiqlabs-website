import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';

const prisma = new PrismaClient();

/**
 * Get all content for a specific page
 * @route GET /api/admin-cms/content/:pageName
 * @access Private/Admin
 */
export const getPageContents = catchAsync(async (req, res, next) => {
  const { pageName } = req.params;
  const { sectionKey } = req.query;
  
  const where = { pageName };
  if (sectionKey) where.sectionKey = sectionKey;
  
  const contents = await prisma.pageContent.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    results: contents.length,
    data: {
      contents,
    },
  });
});

/**
 * Update page content
 * @route PATCH /api/admin-cms/content/:pageName
 * @access Private/Admin
 */
export const updatePageContent = catchAsync(async (req, res, next) => {
  const { pageName } = req.params;
  const { sectionKey } = req.body;
  
  if (!sectionKey) {
    return next(new AppError('Section key is required', 400));
  }
  
  // Try to find existing content
  let content = await prisma.pageContent.findFirst({
    where: {
      pageName,
      sectionKey,
    },
  });
  
  if (!content) {
    // Create new content if it doesn't exist
    content = await prisma.pageContent.create({
      data: {
        pageName,
        sectionKey,
        ...req.body,
      },
    });
  } else {
    // Update existing content
    content = await prisma.pageContent.update({
      where: { id: content.id },
      data: req.body,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      content,
    },
  });
});

/**
 * Get all page names with content
 * @route GET /api/admin-cms/content
 * @access Private/Admin
 */
export const getAllPageContents = catchAsync(async (req, res, next) => {
  const pageContents = await prisma.pageContent.groupBy({
    by: ['pageName'],
    _count: {
      id: true,
    },
  });

  res.status(200).json({
    status: 'success',
    results: pageContents.length,
    data: {
      pages: pageContents.map(pc => ({
        name: pc.pageName,
        sections: pc._count.id,
      })),
    },
  });
});
