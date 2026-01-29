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

// NEW: Get page-specific SEO data
export const getPageSeo = async (req, res) => {
  try {
    const { pageName } = req.params;
    
    // First find the page by slug
    const page = await prisma.page.findUnique({
      where: { slug: pageName },
      include: { seo: true }
    });
    
    // If page doesn't exist, return empty object with defaults
    if (!page) {
      return res.status(200).json({
        pageSlug: pageName,
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        robots: 'index, follow'
      });
    }
    
    // If page exists but no SEO data, return defaults
    if (!page.seo) {
      return res.status(200).json({
        pageSlug: pageName,
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        robots: 'index, follow'
      });
    }
    
    // Return existing SEO data
    res.status(200).json({
      pageSlug: pageName,
      metaTitle: page.seo.metaTitle || '',
      metaDescription: page.seo.metaDescription || '',
      canonicalUrl: page.seo.canonicalUrl || '',
      robots: page.seo.robots || 'index, follow'
    });
  } catch (error) {
    console.error('Error fetching page SEO:', error);
    res.status(500).json({ error: 'Failed to fetch page SEO data' });
  }
};

// NEW: Update page-specific SEO data
export const updatePageSeo = async (req, res) => {
  try {
    const { pageName } = req.params;
    const { metaTitle, metaDescription, canonicalUrl, robots } = req.body;
    
    // Find or create the page first
    let page = await prisma.page.findUnique({
      where: { slug: pageName }
    });
    
    if (!page) {
      // Create the page if it doesn't exist
      page = await prisma.page.create({
        data: {
          slug: pageName,
          routePath: `/${pageName}`,
          pageType: 'PUBLIC',
          isIndexable: true
        }
      });
    }
    
    // Update or create SEO data
    const data = {
      metaTitle,
      metaDescription,
      canonicalUrl,
      robots
    };
    
    // Check if SEO data already exists for this page
    const existingSeo = await prisma.pageSeo.findUnique({
      where: { pageId: page.id }
    });
    
    let pageSeo;
    if (existingSeo) {
      // Update existing SEO data
      pageSeo = await prisma.pageSeo.update({
        where: { pageId: page.id },
        data: data
      });
    } else {
      // Create new SEO data
      pageSeo = await prisma.pageSeo.create({
        data: {
          pageId: page.id,
          ...data
        }
      });
    }
    
    res.status(200).json({
      pageSlug: pageName,
      metaTitle: pageSeo.metaTitle || '',
      metaDescription: pageSeo.metaDescription || '',
      canonicalUrl: pageSeo.canonicalUrl || '',
      robots: pageSeo.robots || 'index, follow'
    });
  } catch (error) {
    console.error('Error updating page SEO:', error);
    res.status(500).json({ error: 'Failed to update page SEO data' });
  }
};