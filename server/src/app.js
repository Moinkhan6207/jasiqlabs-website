import express from "express";
import cors from "cors"; // CORS import
import helmet from "helmet";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { PrismaClient } from "@prisma/client";
import { env } from "./utils/env.js";
import { robotsRouter } from "./routes/robots.routes.js";
import { sitemapRouter } from "./routes/sitemap.routes.js";
import { publicSeoRouter } from "./routes/publicSeo.routes.js";
import publicPagesRouter from "./routes/publicPages.routes.js";
import leadRoutes from "./routes/leadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import AppError from "./utils/appError.js";
import { protect } from "./middlewares/authMiddleware.js";

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
// 1) CORS SETUP (MOVED TO TOP - VERY IMPORTANT)
// ==========================================
// Helmet ya RateLimit se pehle CORS aana chahiye
const corsOptions = {
  origin: true, // "true" ka matlab: Jo bhi request kare, use aane do (Development fix)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
// Pre-flight requests ko explicitly handle karein
app.options('*', cors(corsOptions));


// 2) GLOBAL MIDDLEWARES
app.use(helmet());

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

// (Purana CORS yahan se hata diya gaya hai)

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// 3) ROUTES
app.get("/health", (_req, res) => res.status(200).json({ status: 'OK' }));

// Public routes
app.use("/api/public/seo", publicSeoRouter);
app.use("/api/public/pages", publicPagesRouter);
app.use("/api/public/leads", leadRoutes); 

// Auth Routes
import authRoutes from './routes/auth.routes.js';
app.use('/api/admin/auth', authRoutes);

// Protected routes
app.use('/api/admin/leads', protect, leadRoutes); 
app.use('/api/admin', protect, adminRoutes);

app.use("/", robotsRouter);
app.use("/", sitemapRouter);

// 4) ERROR HANDLING
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.error('ERROR 💥', err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

// 5) START SERVER
const port = env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;