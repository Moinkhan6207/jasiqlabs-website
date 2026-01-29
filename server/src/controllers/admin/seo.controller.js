import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getSeoSettings = async (req, res) => {
  try {
    let settings = await prisma.seoSettings.findFirst();
    
    if (!settings) {
      // Return default settings if none exist
      settings = {
        siteName: 'JasIQ Labs',
        titleTemplate: '{page} | JasIQ Labs',
        defaultMetaDescription: 'Transforming businesses with innovative technology solutions',
        defaultOgImageUrl: '/images/og-default.jpg',
        defaultFaviconUrl: '/favicon.ico'
      };
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    res.status(500).json({ error: 'Failed to fetch SEO settings' });
  }
};

export const updateSeoSettings = async (req, res) => {
  const { siteName, titleTemplate, defaultMetaDescription, defaultOgImageUrl, defaultFaviconUrl } = req.body;
  
  try {
    const data = {
      siteName,
      titleTemplate,
      defaultMetaDescription,
      defaultOgImageUrl,
      defaultFaviconUrl
    };
    
    // Step 1: Check agar pehle se settings hain
    const existing = await prisma.seoSettings.findFirst();

    let settings;
    if (existing) {
      // Step 2: Agar hain, to UPDATE karo
      settings = await prisma.seoSettings.update({
        where: { id: existing.id },
        data: data
      });
    } else {
      // Step 3: Agar nahi hain, to CREATE karo
      settings = await prisma.seoSettings.create({
        data: data
      });
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    res.status(500).json({ error: 'Failed to update SEO settings' });
  }
};