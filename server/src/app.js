import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path"; // 👈 NEW: Ye Import Zaroori hai
import { PrismaClient } from "@prisma/client";
import { env } from "./utils/env.js";

// Routes Imports
import { robotsRouter } from "./routes/robots.routes.js";
import { sitemapRouter } from "./routes/sitemap.routes.js";
import { publicSeoRouter } from "./routes/publicSeo.routes.js";
import publicPagesRouter from "./routes/publicPages.routes.js";
import publicBlogRouter from "./routes/publicBlog.routes.js";
import publicCareerRouter from "./routes/publicCareer.routes.js";
import publicRoutes from "./routes/public.routes.js";
import leadRoutes from "./routes/leadRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from './routes/auth.routes.js';
import pageContentRoutes from './routes/pageContent.routes.js';
import seoRoutes from './routes/seo.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import adminTestimonialsRoutes from './routes/adminTestimonials.routes.js';

// Utils Imports
import AppError from "./utils/appError.js";
import { protect } from "./middlewares/authMiddleware.js";

// Global Error Handler & Logger
import globalErrorHandler from './controllers/error.controller.js'; 
import requestLogger from './middlewares/requestLogger.js';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

const app = express();

// ==========================================
// 1) CORS SETUP
// ==========================================
const corsOptions = {
  origin: (origin, callback) => {
    // Postman testing ke liye !origin allow kiya hai
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 2) GLOBAL MIDDLEWARES
app.use(helmet());

// Logging
if (env.NODE_ENV === 'development') {
  // Dynamic import for morgan in dev only
  import('morgan').then((morgan) => {
     app.use(morgan.default('dev'));
  });
}

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, 
  message: 'Too many requests, please try again later.'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(xss());
app.use(hpp());
app.use(compression());

// 👇 FIX: Static Files (Images) Sahi tarike se serve karein
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});
app.use(requestLogger);

// ==========================================
// 3) ROUTES (Order Matters!)
// ==========================================

app.get("/health", (_req, res) => res.status(200).json({ status: 'OK' }));

// A. Public Routes (No Login Required)
app.use("/api/public", publicRoutes);
app.use("/api/public/seo", publicSeoRouter);
app.use("/api/public/pages", publicPagesRouter);
app.use("/api/public/leads", leadRoutes);
app.use("/api/public/blog", publicBlogRouter);
app.use("/api/public/careers", publicCareerRouter);
app.use("/api/public/testimonials", testimonialRoutes);

// B. Authentication (Login) - MUST BE PUBLIC
// 👈 YE LINE SAHI HAI (Yahan 'protect' nahi hona chahiye)
app.use('/api/admin/auth', authRoutes);

// C. Protected Routes (Login Required)
// Iske andar jo bhi routes hain, unke liye token chahiye
app.use('/api/admin', protect, adminRoutes);
app.use('/api/admin/testimonials', protect, adminTestimonialsRoutes);

// D. Mixed Routes (Check inside file for protection)
app.use('/api/content', pageContentRoutes); // Make sure update routes are protected inside
app.use('/api/seo', seoRoutes);
// ⚠️ Note: Testimonial routes are now properly mounted above for both public and admin

// E. SEO Files
app.use("/", robotsRouter);
app.use("/", sitemapRouter);

// ==========================================
// 4) ERROR HANDLING
// ==========================================

// 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// 5) START SERVER
const port = env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;