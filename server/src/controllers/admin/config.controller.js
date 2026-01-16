import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';

const prisma = new PrismaClient();

/**
 * Get all global configs
 * @route GET /api/admin-cms/config
 * @access Private/Admin
 */
export const getGlobalConfigs = catchAsync(async (req, res, next) => {
  const { isPublic } = req.query;
  
  const where = {};
  if (isPublic === 'true') where.isPublic = true;
  if (isPublic === 'false') where.isPublic = false;
  
  const configs = await prisma.globalConfig.findMany({
    where,
    orderBy: { key: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    results: configs.length,
    data: {
      configs,
    },
  });
});

/**
 * Update a global config
 * @route PATCH /api/admin-cms/config/:key
 * @access Private/Admin
 */
export const updateGlobalConfig = catchAsync(async (req, res, next) => {
  const { key } = req.params;
  const { value, description, isPublic } = req.body;
  
  if (value === undefined && description === undefined && isPublic === undefined) {
    return next(new AppError('No valid fields to update', 400));
  }
  
  const updateData = {};
  if (value !== undefined) updateData.value = value;
  if (description !== undefined) updateData.description = description;
  if (isPublic !== undefined) updateData.isPublic = isPublic;
  
  try {
    const config = await prisma.globalConfig.update({
      where: { key },
      data: updateData,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        config,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      // Config doesn't exist, create it
      const newConfig = await prisma.globalConfig.create({
        data: {
          key,
          value: value || {},
          description: description || '',
          isPublic: isPublic !== undefined ? isPublic : false,
        },
      });
      
      return res.status(201).json({
        status: 'success',
        data: {
          config: newConfig,
        },
      });
    }
    
    // Re-throw other errors
    throw error;
  }
});

/**
 * Get a public config value by key
 * @route GET /api/config/:key
 * @access Public
 */
export const getPublicConfig = catchAsync(async (req, res, next) => {
  const { key } = req.params;
  
  const config = await prisma.globalConfig.findUnique({
    where: { 
      key,
      isPublic: true,
    },
  });
  
  if (!config) {
    return next(new AppError('No public configuration found with that key', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      key: config.key,
      value: config.value,
    },
  });
});
