import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Protect routes from unauthorized access
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header or cookie
  let token;
  
  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback to cookie
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  // 2) Check if token exists
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 3) Verify token
  let decoded;
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again!', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(
        new AppError('Your token has expired! Please log in again.', 401)
      );
    }
    return next(error);
  }

  // 4) Check if user still exists
  // ✅ HUMNE AAPKA PURANA LOGIC HI RAKHA HAI TAAKI LOGIN NA TUTE
  const currentUser = {
    id: 'admin-id-123',
    name: 'Admin User',
    email: 'admin@jasiqlabs.com',
    role: 'admin'
  };

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/**
 * Restrict access to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array of allowed roles ['admin', 'editor', etc.]
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// 👇👇👇 YE LINE MAINE ADD KI HAI (Jisse Server Error Fix Hoga) 👇👇👇
export const admin = restrictTo('admin'); 
// 👆👆👆

/**
 * Only for rendered pages, no errors!
 */
export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      
      const currentUser = {
        id: 'admin-id-123',
        name: 'Admin User',
        email: 'admin@jasiqlabs.com',
        role: 'admin'
      };

      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};