import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';

const prisma = new PrismaClient();

/**
 * Get all active programs
 * @route GET /api/public/programs
 * @access Public
 */
export const getPrograms = catchAsync(async (req, res, next) => {
  const programs = await prisma.divisionContent.findMany({
    where: {
      type: 'PROGRAM',
      status: 'Active'
    },
    orderBy: {
      order: 'asc'
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      features: true,
      coverImage: true,
      icon: true,
      status: true,
      metadata: true,
      seoTitle: true,
      seoDesc: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.status(200).json({
    status: 'success',
    results: programs.length,
    data: {
      programs
    }
  });
});

/**
 * Get all active services
 * @route GET /api/public/services
 * @access Public
 */
export const getServices = catchAsync(async (req, res, next) => {
  const services = await prisma.divisionContent.findMany({
    where: {
      type: 'SERVICE',
      status: 'Active'
    },
    orderBy: {
      order: 'asc'
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      features: true,
      coverImage: true,
      icon: true,
      status: true,
      metadata: true,
      seoTitle: true,
      seoDesc: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services
    }
  });
});

/**
 * Get all products (MVP and Live status, excluding Research)
 * @route GET /api/public/products
 * @access Public
 */
export const getProducts = catchAsync(async (req, res, next) => {
  const products = await prisma.divisionContent.findMany({
    where: {
      type: 'PRODUCT',
      status: {
        not: 'Research'
      }
    },
    orderBy: {
      order: 'asc'
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      features: true,
      coverImage: true,
      icon: true,
      status: true,
      metadata: true,
      seoTitle: true,
      seoDesc: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});
