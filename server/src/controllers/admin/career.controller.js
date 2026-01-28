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
  
  // 👇 FIX: Status ko wapas updateData me daalna zaroori hai!
  if (status) {
    updateData.status = status;
  }

  // Handle status change logic (Auto-set Posted Date)
  if (status === 'PUBLISHED') {
    // Agar pehle se postedAt nahi hai, to abhi ka time daalo
    // Note: Hum check nahi kar rahe ki pehle kya tha, bas naya date daal rahe hain agar missing hai
    updateData.postedAt = new Date(); 
  }
  
  if (expiresAt) {
    updateData.expiresAt = new Date(expiresAt);
  }

  const updatedJob = await prisma.jobOpening.update({
    where: { id: req.params.id },
    data: updateData,
  });

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

/**
 * Get all published job openings for public
 */
export const getPublicJobs = catchAsync(async (req, res, next) => {
  const jobs = await prisma.jobOpening.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' }
  });
  
  // 👈 NEW: Structured Access Log
  logger.info('Fetched published jobs', {
    event: 'PUBLIC_JOBS_FETCHED',
    count: jobs.length,
    correlationId: req.correlationId
  });
  
  res.status(200).json({ 
    status: 'success', 
    results: jobs.length, 
    data: { jobs } 
  });
});

// ... Upar purane functions honge ...

/**
 * 1. PUBLIC: Apply for a Job (User ke liye)
 */
export const applyForJob = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const { name, email, phone, resumeLink, coverLetter } = req.body;

  // 1. Check karein ki Job exist karti hai ya nahi
  const job = await prisma.jobOpening.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  // 2. Check karein ki kya Applications ACCEPT ho rahi hain?
  // Agar Admin ne switch OFF kiya hai, to mana kar do.
  if (!job.acceptingApplications) {
    return next(new AppError('Applications for this position are currently closed.', 400));
  }

  // 3. Application Save karein
  const application = await prisma.jobApplication.create({
    data: {
      name,
      email,
      phone,
      resumeLink,
      coverLetter,
      jobId
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Application submitted successfully!',
    data: { application }
  });
});

/**
 * 2. ADMIN: Toggle Application Status (ON/OFF switch)
 */
export const toggleApplicationStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Job dhundo
  const job = await prisma.jobOpening.findUnique({ where: { id } });
  if (!job) return next(new AppError('Job not found', 404));

  // Switch ko ulta kar do (True -> False, False -> True)
  const updatedJob = await prisma.jobOpening.update({
    where: { id },
    data: { acceptingApplications: !job.acceptingApplications }
  });

  res.status(200).json({
    status: 'success',
    message: `Applications are now ${updatedJob.acceptingApplications ? 'OPEN' : 'CLOSED'} for this job.`,
    data: { 
      isAccepting: updatedJob.acceptingApplications 
    }
  });
});

/**
 * 3. ADMIN: Get Applications for a Job (View Applicants)
 */
export const getJobApplications = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Job ID

  const applications = await prisma.jobApplication.findMany({
    where: { jobId: id },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: { applications }
  });
});