import { PrismaClient } from '@prisma/client';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const prisma = new PrismaClient();

/**
 * Get a single service by slug
 * @route GET /api/public/services/:slug
 * @access Public
 */
export const getServiceBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  
  const service = await prisma.divisionContent.findFirst({
    where: {
      slug,
      type: 'SERVICE',
      status: 'Active' // Only return active services
    },
  });

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      service: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        type: service.metadata?.type,
        status: service.status,
        features: service.features,
        coverImage: service.coverImage,
        icon: service.icon,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      },
    },
  });
});

/**
 * Get all active services
 * @route GET /api/public/services
 * @access Public
 */
export const getAllServices = catchAsync(async (req, res, next) => {
  const services = await prisma.divisionContent.findMany({
    where: {
      type: 'SERVICE',
      status: 'Active'
    },
    orderBy: { order: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services: services.map(service => ({
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        type: service.metadata?.type,
        status: service.status,
        features: service.features,
        coverImage: service.coverImage,
        icon: service.icon,
        order: service.order,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      })),
    },
  });
});

/**
 * Get all active programs
 * @route GET /api/public/programs
 * @access Public
 */
export const getAllPrograms = catchAsync(async (req, res, next) => {
  const programs = await prisma.divisionContent.findMany({
    where: {
      type: 'PROGRAM',
      status: 'Active'
    },
    orderBy: { order: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    results: programs.length,
    data: {
      programs: programs.map(program => ({
        id: program.id,
        name: program.name,
        slug: program.slug,
        description: program.description,
        status: program.status,
        features: program.features,
        coverImage: program.coverImage,
        icon: program.icon,
        order: program.order,
        metadata: program.metadata,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt
      })),
    },
  });
});

/**
 * Get all active products
 * @route GET /api/public/products
 * @access Public
 */
export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await prisma.divisionContent.findMany({
    where: {
      type: 'PRODUCT',
      status: {
        not: 'Research'
      }
    },
    orderBy: { order: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        status: product.status,
        features: product.features,
        coverImage: product.coverImage,
        icon: product.icon,
        order: product.order,
        problem: product.metadata?.problem,
        solution: product.metadata?.solution,
        targetUsers: product.metadata?.targetUsers,
        isMVP: product.metadata?.isMVP,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })),
    },
  });
});
