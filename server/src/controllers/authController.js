import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // Remove password from output
  const { password, ...adminWithoutPassword } = admin;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin: adminWithoutPassword
    }
  });
};

/**
 * @desc    Login admin
 * @route   POST /api/admin/login
 * @access  Public
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if admin exists
  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(admin, 200, res);
});

/**
 * @desc    Protect routes from unauthorized access
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if admin still exists
  const currentAdmin = await prisma.admin.findUnique({
    where: { id: decoded.id }
  });

  if (!currentAdmin) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if admin changed password after the token was issued
  if (currentAdmin.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentAdmin.passwordChangedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimestamp) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.admin = currentAdmin;
  res.locals.admin = currentAdmin;
  next();
});

/**
 * @desc    Restrict access to certain roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.admin.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * @desc    Get current logged in admin
 * @route   GET /api/admin/me
 * @access  Private
 */
export const getMe = (req, res, next) => {
  req.params.id = req.admin.id;
  next();
};

/**
 * @desc    Update admin password
 * @route   PATCH /api/admin/updateMyPassword
 * @access  Private
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get admin from collection
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin.id }
  });

  if (!admin) {
    return next(new AppError('Admin not found', 404));
  }

  // 2) Check if POSTed current password is correct
  if (!(await bcrypt.compare(req.body.passwordCurrent, admin.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  
  const updatedAdmin = await prisma.admin.update({
    where: { id: req.admin.id },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date()
    }
  });

  // 4) Log admin in, send JWT
  createSendToken(updatedAdmin, 200, res);
});
