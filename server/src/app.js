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
import { robotsRouter } from "./routes/robots.routes.js";
import { sitemapRouter } from "./routes/sitemap.routes.js";
import { publicSeoRouter } from "./routes/publicSeo.routes.js";
import publicPagesRouter from "./routes/publicPages.routes.js";
import leadsRouter from "./routes/leads.routes.js";
import leadRoutes from "./routes/leadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import AppError from "./utils/appError.js";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Graceful shutdown function
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    console.log('Prisma Client disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
if (env.NODE_ENV === 'development') {
  const morgan = await import('morgan');
  app.use(morgan.default('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
  ]
}));

// Enable CORS
const corsOptions = {
  origin: [
    env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Compression
app.use(compression());

// Add Prisma to request object
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// 2) ROUTES
// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Public routes
app.use("/api/public/seo", publicSeoRouter);
app.use("/api/public/pages", publicPagesRouter);
app.use("/api/public/leads", leadsRouter);

// API routes
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

// Robots & Sitemap (Root level)
app.use("/", robotsRouter);
app.use("/", sitemapRouter);

// 3) ERROR HANDLING MIDDLEWARE
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error in development
  console.error(`[${new Date().toISOString()}] ${err.statusCode} ${err.status}: ${err.message}`);
  if (err.stack && env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered. Please use another value.'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again!'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Your token has expired! Please log in again.'
    });
  }

  // Development error handler
  if (env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Production error handler
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Unknown errors in production
  console.error('ERROR 💥', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
});

// 4) START SERVER
const port = env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port} in ${env.NODE_ENV} mode`);
  
  // Log all registered routes in development
  if (env.NODE_ENV === 'development') {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // Routes registered directly on the app
        const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
        routes.push(`${methods.padEnd(6)} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Routes added as router
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
            routes.push(`${methods.padEnd(6)} ${handler.route.path}`);
          }
        });
      }
    });
    
    console.log('\nRegistered Routes:');
    console.log(routes.join('\n'));
  }
});

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error('Error:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error('Error:', err);
  server.close(() => {
    process.exit(1);
  });
});

export default app;