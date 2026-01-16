import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Create Lead (Public - Contact Form se aayega)
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, message, interestType, division } = req.body;

    // Basic Validation
    if (!name || !email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name and Email are required'
      });
    }

    // Save to Database
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        message,
        interestType: interestType || 'Client',
        division: division || 'General',
        status: 'New'
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        lead: newLead
      }
    });

  } catch (error) {
    console.error("Create Lead Error:", error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit lead',
      error: error.message
    });
  }
};

// 2. Get All Leads (Admin Only)
export const getLeads = async (req, res) => {
  try {
    // Query params for filtering (optional)
    const { status, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      results: leads.length,
      data: {
        leads
      }
    });
  } catch (error) {
    console.error("Get Leads Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. Get Single Lead
export const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { lead }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. Update Lead Status
export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({
      status: 'success',
      data: { lead: updatedLead }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. Delete Lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 6. Export Leads to CSV
export const exportLeadsToCSV = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Simple CSV conversion
    const fields = ['id', 'name', 'email', 'phone', 'status', 'createdAt'];
    let csv = fields.join(',') + '\n';

    leads.forEach(lead => {
      const row = [
        lead.id,
        `"${lead.name}"`,
        lead.email,
        lead.phone || '',
        lead.status,
        lead.createdAt.toISOString()
      ];
      csv += row.join(',') + '\n';
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ status: 'error', message: 'Failed to export CSV' });
  }
};