import dotenv from 'dotenv';

// Ye line sabse zaroori hai (.env file padhne ke liye)
dotenv.config();

export const env = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 8080,
    DATABASE_URL: process.env.DATABASE_URL,
    SITE_URL: process.env.SITE_URL || "https://jasiqlabs.com",
    CORS_ORIGINS: (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174,https://jasiqlabs-website-1.onrender.com")
      .split(',')
      .map(origin => origin.trim().replace(/^"|"$/g, ''))
      .filter(Boolean)
      .concat("http://localhost:5173", "http://localhost:5174") // Ensure both ports are included
  };
  
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required in server/.env");
  }
  