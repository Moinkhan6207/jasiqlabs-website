import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getSystemSettings = async (req, res) => {
  try {
    let settings = await prisma.systemSetting.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.systemSetting.create({
        data: {
          maintenanceMode: false,
          thankYouPage: {
            title: "Thank You!",
            message: "Your submission has been received successfully. We'll get back to you soon."
          },
          notFoundPage: {
            title: "Page Not Found",
            message: "The page you're looking for doesn't exist or has been moved."
          }
        }
      });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ error: 'Failed to fetch system settings' });
  }
};

export const updateSystemSettings = async (req, res) => {
  const { maintenanceMode, thankYouPage, notFoundPage } = req.body;
  
  try {
    const data = {
      maintenanceMode,
      thankYouPage,
      notFoundPage
    };
    
    // Check if settings already exist
    const existing = await prisma.systemSetting.findFirst();

    let settings;
    if (existing) {
      // Update existing settings
      settings = await prisma.systemSetting.update({
        where: { id: existing.id },
        data: data
      });
    } else {
      // Create new settings
      settings = await prisma.systemSetting.create({
        data: data
      });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ error: 'Failed to update system settings' });
  }
};
