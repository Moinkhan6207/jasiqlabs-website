import jwt from 'jsonwebtoken';

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
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

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Hardcoded Admin Check (in production, use a database)
    if (email === 'admin@jasiqlabs.com' && password === 'admin123') {
      const token = signToken('admin-id-123');
      
      // Set cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };
      
      res.cookie('jwt', token, cookieOptions);

      // Send response with token and user data
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
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};

// 2. GET CURRENT USER
export const getMe = (req, res) => {
  try {
    // User is already attached to req by the protect middleware
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
    console.error('Get me error:', error);
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
    
    res.status(200).json({ 
      status: 'success',
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during logout'
    });
  }
};