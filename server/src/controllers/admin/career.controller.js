import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import logger from '../../utils/logger.js';

const prisma = new PrismaClient();

/**
 * Get all job openings
 */
export const getJobOpenings = catchAsync(async (req, res, next) => {
  const { status, type, limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  
  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;

  const [jobs, total] = await Promise.all([
    prisma.jobOpening.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { postedAt: 'desc' },
    }),
    prisma.jobOpening.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    results: jobs.length,
    total,
    data: {
      jobs,
    },
  });
});

/**
 * Get a single job opening
 */
export const getJobOpening = catchAsync(async (req, res, next) => {
  const job = await prisma.jobOpening.findUnique({
    where: { id: req.params.id },
  });

  if (!job) {
    // 👈 NEW: Structured Warning
    logger.warn('Job Opening not found', {
      event: 'JOB_NOT_FOUND',
      jobId: req.params.id,
      correlationId: req.correlationId
    });
    return next(new AppError('No job opening found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      job,
    },
  });
});

/**
 * Create a new job opening
 */
export const createJobOpening = catchAsync(async (req, res, next) => {
  const {
    title,
    type,
    location,
    description,
    requirements = [],
    responsibilities = [],
    salaryRange,
    experience,
    expiresAt,
  } = req.body;
  
  const job = await prisma.jobOpening.create({
    data: {
      title,
      type,
      location,
      description,
      requirements,
      responsibilities,
      salaryRange: salaryRange || null,
      experience: experience || null,
      status: 'DRAFT',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  // 👈 NEW: Structured Success Log
  logger.info('New Job Position Created', {
    event: 'JOB_CREATED',
    jobId: job.id,
    title: title,
    type: type,
    location: location,
    userId: req.user?.id || 'admin',
    correlationId: req.correlationId
  });

  res.status(201).json({
    status: 'success',
    data: {
      job,
    },
  });
});

/**
 * Update a job opening
 */
export const updateJobOpening = catchAsync(async (req, res, next) => {
  const {
    status,
    expiresAt,
    ...updateData
  } = req.body;
  
  // Handle status change
  if (status === 'PUBLISHED' && !updateData.postedAt) {
    updateData.postedAt = new Date();
  }
  
  if (expiresAt) {
    updateData.expiresAt = new Date(expiresAt);
  }

  const updatedJob = await prisma.jobOpening.update({
    where: { id: req.params.id },
    data: updateData,
  });

  // 👈 NEW: Structured Update Log
  logger.info('Job Opening Updated', {
    event: 'JOB_UPDATED',
    jobId: req.params.id,
    title: updatedJob.title,
    status: updatedJob.status,
    userId: req.user?.id || 'admin',
    correlationId: req.correlationId
  });

  res.status(200).json({
    status: 'success',
    data: {
      job: updatedJob,
    },
  });
});

/**
 * Delete a job opening
 */
export const deleteJobOpening = catchAsync(async (req, res, next) => {
  const deletedJob = await prisma.jobOpening.delete({
    where: { id: req.params.id },
  });

  // 👈 NEW: Structured Deletion Log
  logger.info('Job Opening Deleted', {
    event: 'JOB_DELETED',
    jobId: req.params.id,
    title: deletedJob.title,
    userId: req.user?.id || 'admin',
    correlationId: req.correlationId
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});