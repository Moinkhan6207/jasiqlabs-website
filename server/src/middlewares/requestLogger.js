import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  // 1. Har request ko ek Unique ID dein (Token number ki tarah)
  req.requestId = uuidv4();
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  
  // 2. Start Time note karein
  const start = Date.now();

  // 3. Jab Response khatam ho jaye (finish event), tab log karein
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Logger ko call karein saare data ke saath
    logger.info('API Request Processed', {
      correlationId: req.correlationId,
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      userId: req.user ? req.user.id : 'guest', // Agar user login hai to ID, nahi to guest
      event: 'API_RESPONSE_SENT',
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent')
    });
  });

  next();
};

export default requestLogger;