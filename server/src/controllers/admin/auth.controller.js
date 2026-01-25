import jwt from 'jsonwebtoken';
import logger from '../../utils/logger.js';

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    // Critical Error (Isme req object nahi hai, to bas message)
    logger.error('JWT_SECRET is not defined', { event: 'CONFIG_ERROR' });
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// 1. LOGIN FUNCTION
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // A. Input validation
    if (!email || !password) {
      // 👈 NEW: Message ke baad { object } pass kiya
      logger.warn('Login failed: Missing email or password', {
        event: 'LOGIN_BAD_REQUEST',
        ip: req.ip,
        correlationId: req.correlationId, // Middleware se aaya ID
        requestId: req.requestId
      });

      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // B. Hardcoded Admin Check
    if (email === 'admin@jasiqlabs.com' && password === 'admin123') {
      const token = signToken('admin-id-123');
      
      const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };
      
      res.cookie('jwt', token, cookieOptions);

      // 👈 NEW: Success Log with Metadata
      logger.info('Admin logged in successfully', {
        event: 'USER_LOGIN_SUCCESS',
        userId: 'admin-id-123',
        email: email,
        ip: req.ip,
        correlationId: req.correlationId,
        requestId: req.requestId
      });

      res.status(200).json({
        status: 'success',
        token,
        data: {
          user: {
            id: 'admin-id-123',
            name: 'Admin User',
            email: email,
            role: 'admin'
          }
        }
      });
    } else {
      // 👈 NEW: Security Alert (Failed Attempt)
      logger.warn('Failed login attempt (Wrong Credentials)', {
        event: 'LOGIN_FAILED',
        email: email, // Email log karein taaki pata chale kis account pe attack hua
        ip: req.ip,
        correlationId: req.correlationId
      });
      
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }
  } catch (error) {
    // 👈 NEW: System Error
    logger.error(`Login System Error: ${error.message}`, {
      event: 'LOGIN_SYSTEM_ERROR',
      stack: error.stack,
      correlationId: req.correlationId
    });

    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};

// 2. GET CURRENT USER
export const getMe = (req, res) => {
  try {
    // Success log ki zaroorat nahi hai (Too noisy), sirf Error log karein
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user || {
          id: 'admin-id-123',
          name: 'Admin User',
          email: 'admin@jasiqlabs.com',
          role: 'admin'
        }
      }
    });
  } catch (error) {
    // 👈 NEW: Error Log
    logger.error(`GetMe Error: ${error.message}`, {
      event: 'USER_FETCH_ERROR',
      userId: req.user?.id,
      correlationId: req.correlationId
    });

    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user data'
    });
  }
};

// 3. LOGOUT
export const logout = (req, res) => {
  try {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    // 👈 NEW: Logout Log
    logger.info('Admin logged out', {
      event: 'USER_LOGOUT',
      userId: req.user?.id || 'admin-id-123',
      correlationId: req.correlationId
    });

    res.status(200).json({ 
      status: 'success',
      message: 'Successfully logged out'
    });
  } catch (error) {
    // 👈 NEW: Logout Error
    logger.error(`Logout Error: ${error.message}`, {
      event: 'LOGOUT_ERROR',
      correlationId: req.correlationId
    });

    res.status(500).json({
      status: 'error',
      message: 'An error occurred during logout'
    });
  }
};