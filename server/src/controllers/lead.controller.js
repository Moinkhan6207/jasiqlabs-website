import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new lead (Public endpoint)
 */
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, interestType = 'STUDENT', message = '', source = 'WEBSITE' } = req.body;

    console.log("📩 Received Lead:", { name, email, phone, interestType, source });

    // 1. Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, Email, and Phone are required." });
    }

    // 2. Validate and normalize interestType
    const validInterestTypes = ['STUDENT', 'CLIENT', 'PARTNER'];
    const normalizedInterestType = interestType.toUpperCase();
    
    if (!validInterestTypes.includes(normalizedInterestType)) {
      return res.status(400).json({ 
        error: "Invalid interest type. Must be one of: " + validInterestTypes.join(', ')
      });
    }

    // 3. Determine division based on interest type
    const divisionMap = {
      'STUDENT': 'RWS',
      'CLIENT': 'TWS',
      'PARTNER': 'PRODUCTS'
    };
    
    const division = divisionMap[normalizedInterestType] || 'RWS';

    // 4. Save to database
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        interestType: normalizedInterestType,
        division,
        source,
        message,
      },
    });

    console.log("✅ Lead Saved:", newLead);
    return res.status(201).json({
      status: 'success',
      data: {
        lead: newLead
      }
    });

  } catch (error) {
    console.error("❌ Error saving lead:", error);
    
    // Handle specific error cases
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        status: 'error',
        message: 'A lead with this email or phone already exists.'
      });
    }
    
    if (error.message.includes("Argument `interestType`")) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid interest type. Must be one of: STUDENT, CLIENT, PARTNER'
      });
    }

    return res.status(500).json({ 
      status: 'error',
      message: 'Failed to save lead',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



/**
 * Get all leads (Admin only)
 * Supports filtering by interestType, division, and search
 */
export const getAllLeads = async (req, res) => {
  try {
    const { interestType, division, search } = req.query;
    
    // Build the where clause for filtering
    const where = {};
    
    if (interestType) {
      where.interestType = interestType.toUpperCase();
    }
    
    if (division) {
      where.division = division.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch leads with filters
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { 
        createdAt: 'desc' // Newest first
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        interestType: true,
        division: true,
        message: true,
        source: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      status: 'success',
      results: leads.length,
      data: {
        leads
      }
    });
  } catch (error) {
    console.error("❌ Get Leads Error:", error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch leads',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Export leads as CSV (Admin only)
 */
export const exportLeads = async (req, res) => {
  try {
    // Get all leads (no pagination for export)
    const leads = await prisma.lead.findMany({
      orderBy: { 
        createdAt: 'desc' 
      }
    });

    // Convert to CSV
    const csvFields = ['Name', 'Email', 'Phone', 'Type', 'Division', 'Source', 'Status', 'Message', 'Created At'];
    
    // Escape CSV values
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Generate CSV content
    const csvRows = [];
    csvRows.push(csvFields.join(','));
    
    for (const lead of leads) {
      const row = [
        escapeCsv(lead.name),
        escapeCsv(lead.email),
        escapeCsv(lead.phone),
        escapeCsv(lead.interestType),
        escapeCsv(lead.division),
        escapeCsv(lead.source),
        escapeCsv(lead.status),
        escapeCsv(lead.message),
        escapeCsv(new Date(lead.createdAt).toISOString())
      ];
      csvRows.push(row.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export_' + new Date().toISOString().split('T')[0] + '.csv');
    res.status(200).send(csvContent);
    
  } catch (error) {
    console.error("❌ Export Error:", error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to export leads',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};