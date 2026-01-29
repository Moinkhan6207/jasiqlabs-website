// 👇 SAHI IMPORT (Central connection use karein)
import { prisma } from '../../db/prisma.js'; 
// ❌ const prisma = new PrismaClient();  <-- YE LINE HATA DI GAYI HAI

/**
 * @desc    Get page content by page name and section key
 * @route   GET /api/content/:pageName/:sectionKey
 * @access  Public
 */
export const getPageContent = async (req, res, next) => {
  try {
    const { pageName, sectionKey } = req.params;

    const content = await prisma.pageContent.findUnique({
      where: {
        pageName_sectionKey: {
          pageName,
          sectionKey,
        },
      },
    });

    // Note: Agar content nahi mila, to hum 200 OK ke saath null bhejenge
    // Taaki Frontend par error na aaye aur wo default text dikha sake.
    if (!content) {
      return res.status(200).json({
        success: true,
        data: null, 
      });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update page content
 * @route   POST /api/content
 * @access  Private/Admin
 */
export const upsertPageContent = async (req, res, next) => {
  try {
    const { 
      pageName, 
      sectionKey, 
      title, 
      subtitle, 
      description, 
      content, 
      visionTitle, 
      visionDesc, 
      missionTitle, 
      missionDesc, 
      isActive = true 
    } = req.body;

    if (!pageName || !sectionKey) {
      return res.status(400).json({
        success: false,
        message: 'pageName and sectionKey are required',
      });
    }

    // Data object prepare karein (Null handling ke saath)
    const data = {
      pageName,
      sectionKey,
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      content: content || null, // JSON content ke liye null theek hai
      visionTitle: visionTitle || '',
      visionDesc: visionDesc || '',
      missionTitle: missionTitle || '',
      missionDesc: missionDesc || '',
      isActive,
    };

    // Upsert the content
    const result = await prisma.pageContent.upsert({
      where: {
        pageName_sectionKey: {
          pageName,
          sectionKey,
        },
      },
      update: data,
      create: data,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};