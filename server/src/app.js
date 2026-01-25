import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { PrismaClient } from "@prisma/client";
import { env } from "./utils/env.js";

// Routes Imports
import { robotsRouter } from "./routes/robots.routes.js";
import { sitemapRouter } from "./routes/sitemap.routes.js";
import { publicSeoRouter } from "./routes/publicSeo.routes.js";
import publicPagesRouter from "./routes/publicPages.routes.js";
import leadRoutes from "./routes/leadRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from './routes/auth.routes.js';

// Utils Imports
import AppError from "./utils/appError.js";
import { protect } from "./middlewares/authMiddleware.js";

// 👇 NEW: Global Error Handler Import kiya
import globalErrorHandler from './controllers/error.controller.js'; 
import requestLogger from './middlewares/requestLogger.js';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Graceful shutdown function
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
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// 2) GLOBAL MIDDLEWARES
app.use(helmet());

// Development Logging (Morgan) - Ise rehne de sakte hain ya hata sakte hain
if (env.NODE_ENV === 'development') {
  const morgan = await import('morgan');
  app.use(morgan.default('dev'));
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

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});
app.use(requestLogger);

// 3) ROUTES
app.get("/health", (_req, res) => res.status(200).json({ status: 'OK' }));

// Public routes
app.use("/api/public/seo", publicSeoRouter);
app.use("/api/public/pages", publicPagesRouter);
app.use("/api/public/leads", leadRoutes); 

// Auth Routes
app.use('/api/admin/auth', authRoutes);

// Protected routes
app.use('/api/admin', protect, adminRoutes);

// SEO Routes
app.use("/", robotsRouter);
app.use("/", sitemapRouter);

// 4) ERROR HANDLING

// A. 404 Handler (Agar route na mile)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// B. Global Error Handler (Hamesha last me aana chahiye)
// 👇 NEW: Purana code hata kar ye lagaya
app.use(globalErrorHandler);


// 5) START SERVER
const port = env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;