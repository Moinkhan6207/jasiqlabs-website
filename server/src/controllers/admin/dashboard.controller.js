import { PrismaClient } from '@prisma/client';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';

const prisma = new PrismaClient();

/**
 * Get dashboard statistics
 * @route GET /api/admin-cms/dashboard/stats
 * @access Private/Admin
 */
export const getDashboardStats = catchAsync(async (req, res, next) => {
  const [
    totalLeads,
    studentLeads,
    clientLeads,
    blogPosts,
    jobOpenings,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { interestType: 'STUDENT' } }),
    prisma.lead.count({ where: { interestType: 'CLIENT' } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.jobOpening.count({ where: { status: 'PUBLISHED' } }),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalLeads,
        studentLeads,
        clientLeads,
        blogPosts,
        jobOpenings,
      },
    },
  });
});

/**
 * Get recent leads
 * @route GET /api/admin-cms/dashboard/recent-leads
 * @access Private/Admin
 */
export const getRecentLeads = catchAsync(async (req, res, next) => {
  const recentLeads = await prisma.lead.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      interestType: true,
      division: true,
      status: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    status: 'success',
    results: recentLeads.length,
    data: {
      leads: recentLeads,
    },
  });
});
