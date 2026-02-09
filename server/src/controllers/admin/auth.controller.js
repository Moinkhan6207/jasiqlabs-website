import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Password check ke liye
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger.js';

const prisma = new PrismaClient();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// 1. LOGIN FUNCTION
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Log "Login Request Received" with the email from req.body
    console.log('Login Request Received - Email:', email);

    // A. Input validation
    if (!email || !password) {
      console.log('Login Failed - Missing email or password');
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // B. Database Check (REAL CODE)
    // 2. Log "Searching for Admin in Database..."
    console.log('Searching for Admin in Database...');
    
    // 1. Admin ko email se dhundho
    const admin = await prisma.admin.findUnique({
      where: { email: email }
    });

    // 3. Log whether the Admin was found or not
    if (!admin) {
      console.log('Admin Not Found - Email:', email);
    } else {
      console.log('Admin Found - Email:', email);
      
      // 4. If Admin exists, log the stored hashed password (first 10 chars for safety)
      console.log('Stored Hashed Password (first 10 chars):', admin.password.substring(0, 10) + '...');
    }

    // 5. Log "Comparing Passwords..."
    console.log('Comparing Passwords...');
    
    // Compare password and log result
    const passwordMatch = await bcrypt.compare(password, admin ? admin.password : '');
    
    // 6. Log the result of bcrypt.compare (True/False)
    console.log('Password Comparison Result:', passwordMatch);

    // 2. Agar admin nahi mila YA password galat hai
    if (!admin || !passwordMatch) {
      // 7. If login fails, log exactly why (Invalid Email vs Invalid Password)
      if (!admin) {
        console.log('Login Failed - Invalid Email:', email);
      } else {
        console.log('Login Failed - Invalid Password for Email:', email);
      }
      
      logger.warn('Failed login attempt (Wrong Credentials)', {
        event: 'LOGIN_FAILED',
        email: email,
        ip: req.ip
      });
      
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    console.log('Login Successful - Email:', email);

    // 3. Sab sahi hai -> Token banao (REAL ID se)
    const token = signToken(admin.id);
      
    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
      
    res.cookie('jwt', token, cookieOptions);

    logger.info('Admin logged in successfully', {
      event: 'USER_LOGIN_SUCCESS',
      userId: admin.id, // Real Database ID
      email: email,
      ip: req.ip
    });

    // Password hata kar data bhejo
    admin.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: admin
      }
    });

  } catch (error) {
    // 8. If an error occurs in catch, log the full error object
    console.log('Login Error - Full Error Object:', error);
    console.log('Login Error - Message:', error.message);
    console.log('Login Error - Stack:', error.stack);
    
    logger.error(`Login System Error: ${error.message}`, {
      event: 'LOGIN_SYSTEM_ERROR',
      stack: error.stack
    });

    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};

// 2. GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    // Middleware ne user ko req.user me daal diya hoga
    const currentUser = req.user;

    res.status(200).json({
      status: 'success',
      data: {
        user: currentUser
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user data'
    });
  }
};

// 3. LOGOUT
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
    
  res.status(200).json({ 
    status: 'success',
    message: 'Successfully logged out'
  });
};