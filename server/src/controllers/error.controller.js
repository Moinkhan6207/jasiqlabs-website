// server/src/controllers/error.controller.js
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js'; // Ensure logger path is correct

// User ko Error bhejte waqt Development me sab dikhate hain
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // Code ki lines dikhayega (Debugging ke liye)
  });
};

// Production (Live Website) par user ko daraana nahi hai
const sendErrorProd = (err, res) => {
  // A) Agar ye error humne pehchana hai (Operational)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } 
  // B) Agar ye Code ka Bug hai (Programming Error) - User ko mat batao
  else {
    // 1. Log the error (Developer ke liye)
    logger.error(`PROD ERROR 💥: ${err.message}`, { stack: err.stack });

    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// MAIN GLOBAL HANDLER FUNCTION
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log every error using our Standard Logger
  // (Isse hum baad me file me dekh sakte hain)
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Production ke liye error copy karte hain
    let error = { ...err };
    error.message = err.message;
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;