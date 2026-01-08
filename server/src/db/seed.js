import dotenv from 'dotenv';
import { connectDB } from './connection.js';
import Page from './models/Page.js';
import SeoSettings from './models/SeoSettings.js';

dotenv.config();

const mandatoryPages = [
  {
    slug: '/',
    pageType: 'MAIN_SITE',
    isIndexable: true,
    changeFrequency: 'weekly',
    priority: 1.0
  },
  {
    slug: '/about',
    pageType: 'MAIN_SITE',
    isIndexable: true,
    changeFrequency: 'monthly',
    priority: 0.8
  },
  {
    slug: '/contact',
    pageType: 'MAIN_SITE',
    isIndexable: true,
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    slug: '/realworkstudio',
    pageType: 'REALWORK_STUDIO',
    isIndexable: true,
    changeFrequency: 'weekly',
    priority: 0.9
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Starting database seed...');

    // Seed mandatory pages
    for (const pageData of mandatoryPages) {
      const existingPage = await Page.findOne({ slug: pageData.slug });
      if (!existingPage) {
        await Page.create(pageData);
        console.log(`✓ Created page: ${pageData.slug}`);
      } else {
        console.log(`- Page already exists: ${pageData.slug}`);
      }
    }

    // Ensure SEO defaults exist
    const seoSettings = await SeoSettings.getDefaults();
    console.log(`✓ SEO Settings initialized`);

    console.log('Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

