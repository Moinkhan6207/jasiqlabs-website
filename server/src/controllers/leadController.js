import { prisma } from '../db/prisma.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Public
 */
export const createLead = catchAsync(async (req, res, next) => {
  const { name, email, phone, interestType, division, message } = req.body;

  const newLead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      interestType: interestType || 'STUDENT',
      division: division || 'RWS',
      message,
      source: 'Website',
      status: 'New'
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      lead: newLead
    }
  });
});

/**
 * @desc    Get all leads (with filtering, sorting, and pagination)
 * @route   GET /api/leads
 * @access  Private/Admin
 */
export const getAllLeads = catchAsync(async (req, res, next) => {
  // 1) Filtering
  const { page = 1, limit = 100, sort = '-createdAt', ...filters } = req.query;
  const skip = (page - 1) * limit;
  
  // 2) Build where clause
  const where = {};
  
  // Simple filtering (for exact matches)
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      where[key] = value;
    }
  });

  // 3) Execute query with pagination and sorting
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: sort === '-createdAt' ? { createdAt: 'desc' } : { [sort]: 'asc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.lead.count({ where })
  ]);

  res.status(200).json({
    status: 'success',
    results: leads.length,
    total,
    data: {
      leads
    }
  });
});

/**
 * @desc    Get lead statistics
 * @route   GET /api/leads/stats
 * @access  Private/Admin
 */
export const getLeadStats = catchAsync(async (req, res, next) => {
  // Get count of leads by status
  const stats = await prisma.lead.groupBy({
    by: ['status'],
    _count: {
      _all: true
    },
    orderBy: {
      _count: {
        _all: 'desc'
      }
    }
  });

  // Get total leads count
  const totalLeads = await prisma.lead.count();

  // Format the response to match the expected format
  const formattedStats = stats.map(stat => ({
    _id: stat.status,
    count: stat._count._all
  }));

  res.status(200).json({
    status: 'success',
    data: {
      stats: formattedStats,
      totalLeads
    }
  });
});

/**
 * @desc    Export leads to CSV
 * @route   GET /api/leads/export
 * @access  Private/Admin
 */
export const exportLeads = catchAsync(async (req, res, next) => {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  // Convert leads to CSV format
  const csvHeader = 'Name,Email,Phone,Interest Type,Division,Status,Message,Created At\n';
  const csvRows = leads.map(lead => {
    return `"${lead.name}","${lead.email}","${lead.phone || ''}","${lead.interestType}","${lead.division}","${lead.status}","${lead.message || ''}","${lead.createdAt}"`;
  }).join('\n');
  
  const csv = csvHeader + csvRows;
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
  res.send(csv);
});
