import { prisma } from '../../db/prisma.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import slugify from 'slugify';

/**
 * Get all division contents by type (PROGRAM, SERVICE, or PRODUCT)
 * @route GET /api/admin-cms/divisions/:type
 * @access Private/Admin
 */
export const getDivisionContents = catchAsync(async (req, res, next) => {
  const { type } = req.params;
  const { status, limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  
  const where = { type };
  if (status) where.status = status;

  const [contents, total] = await Promise.all([
    prisma.divisionContent.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { order: 'asc' },
    }),
    prisma.divisionContent.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    results: contents.length,
    total,
    data: {
      contents,
    },
  });
});

/**
 * Get a single division content
 * @route GET /api/admin-cms/divisions/:type/:id
 * @access Private/Admin
 */
export const getDivisionContent = catchAsync(async (req, res, next) => {
  const { type, id } = req.params;
  
  const content = await prisma.divisionContent.findFirst({
    where: {
      id,
      type,
    },
  });

  if (!content) {
    return next(new AppError('No content found with that ID and type', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      content,
    },
  });
});

/**
 * Create a new division content
 * @route POST /api/admin-cms/divisions/:type
 * @access Private/Admin
 */
export const createDivisionContent = catchAsync(async (req, res, next) => {
  const { type } = req.params;
  const {
    name,
    description,
    features = [],
    status = 'DRAFT',
    coverImage = null,
    icon = null,
    metadata = null,
    seoTitle = null,
    seoDesc = null,
    order = 0,
  } = req.body;
  
  if (!name) {
    return next(new AppError('Name is required', 400));
  }
  
  const slug = slugify(name, { lower: true, strict: true });
  
  const content = await prisma.divisionContent.create({
    data: {
      type,
      name,
      slug,
      description: description || '',
      features,
      status,
      coverImage,
      icon,
      metadata,
      seoTitle,
      seoDesc,
      order,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      content,
    },
  });
});

/**
 * Update a division content
 * @route PATCH /api/admin-cms/divisions/:type/:id
 * @access Private/Admin
 */
export const updateDivisionContent = catchAsync(async (req, res, next) => {
  const { type, id } = req.params;
  const { name, ...updateData } = req.body;
  
  // If name is being updated, update the slug as well
  if (name) {
    updateData.slug = slugify(name, { lower: true, strict: true });
  }
  
  const content = await prisma.divisionContent.update({
    where: { id },
    data: updateData,
  });

  // Verify the type matches
  if (content.type !== type) {
    return next(new AppError('Content type does not match', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      content,
    },
  });
});

/**
 * Delete a division content
 * @route DELETE /api/admin-cms/divisions/:type/:id
 * @access Private/Admin
 */
export const deleteDivisionContent = catchAsync(async (req, res, next) => {
  const { type, id } = req.params;
  
  // First verify the type matches
  const content = await prisma.divisionContent.findUnique({
    where: { id },
  });
  
  if (!content) {
    return next(new AppError('No content found with that ID', 404));
  }
  
  if (content.type !== type) {
    return next(new AppError('Content type does not match', 400));
  }
  
  // Delete the content
  await prisma.divisionContent.delete({
    where: { id },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
