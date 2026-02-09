import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Page Content Controllers
export const getPageSettings = async (req, res) => {
  try {
    let pageContent = await prisma.testimonialPageContent.findUnique({
      where: { pageName: 'testimonials' }
    });

    // If no page content exists, create default one
    if (!pageContent) {
      pageContent = await prisma.testimonialPageContent.create({
        data: {
          pageName: 'testimonials',
          title: 'What Our Clients Say',
          subtitle: 'Testimonials from our satisfied clients and partners'
        }
      });
    }

    res.json({
      success: true,
      data: pageContent
    });
  } catch (error) {
    console.error('Error fetching page settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page settings',
      error: error.message
    });
  }
};

export const updatePageSettings = async (req, res) => {
  try {
    const { title, subtitle } = req.body;

    const updatedContent = await prisma.testimonialPageContent.upsert({
      where: { pageName: 'testimonials' },
      update: {
        title: title || undefined,
        subtitle: subtitle || undefined
      },
      create: {
        pageName: 'testimonials',
        title: title || 'What Our Clients Say',
        subtitle: subtitle || 'Testimonials from our satisfied clients and partners'
      }
    });

    res.json({
      success: true,
      data: updatedContent,
      message: 'Page settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating page settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update page settings',
      error: error.message
    });
  }
};

// Testimonial CRUD Controllers
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, company, message, rating, status = 'ACTIVE', order = 0 } = req.body;
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/testimonials/${req.file.filename}`;
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        company: company || null,
        content: message, // Map message to content field
        rating: parseInt(rating),
        status,
        order: parseInt(order),
        image: imageUrl
      }
    });

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error: error.message
    });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const where = status ? { status: status.toUpperCase() } : {};

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.testimonial.count({ where })
    ]);

    // Map content to message for frontend compatibility
    const formattedTestimonials = testimonials.map(testimonial => ({
      ...testimonial,
      message: testimonial.content // Map content to message field
    }));

    res.json({
      success: true,
      data: formattedTestimonials,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, company, message, rating, status, order } = req.body;

    // Get existing testimonial to check for existing image
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    let imageUrl = existingTestimonial.image;
    
    // If new image is uploaded, update the image URL
    if (req.file) {
      imageUrl = `/uploads/testimonials/${req.file.filename}`;
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingTestimonial.name,
        role: role !== undefined ? role : existingTestimonial.role,
        company: company !== undefined ? company : existingTestimonial.company,
        content: message !== undefined ? message : existingTestimonial.content, // Map message to content
        rating: rating !== undefined ? parseInt(rating) : existingTestimonial.rating,
        status: status !== undefined ? status.toUpperCase() : existingTestimonial.status,
        order: order !== undefined ? parseInt(order) : existingTestimonial.order,
        image: imageUrl
      }
    });

    res.json({
      success: true,
      data: updatedTestimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial',
      error: error.message
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await prisma.testimonial.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial',
      error: error.message
    });
  }
};

// Admin: Get single testimonial by ID
export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Map content to message for frontend compatibility
    const formattedTestimonial = {
      ...testimonial,
      message: testimonial.content
    };

    res.json({
      success: true,
      data: formattedTestimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial',
      error: error.message
    });
  }
};

// Public View Controller
export const getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        role: true,
        company: true,
        content: true,
        image: true,
        rating: true,
        order: true
      }
    });

    // Map content to message for frontend compatibility
    const formattedTestimonials = testimonials.map(testimonial => ({
      ...testimonial,
      message: testimonial.content // Map content to message field
    }));

    res.json({
      success: true,
      data: formattedTestimonials
    });
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public testimonials',
      error: error.message
    });
  }
};
