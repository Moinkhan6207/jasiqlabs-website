/**
 * Simple in-memory rate limiter
 * Allows max 20 requests per 10 minutes per IP
 */

// Map to store request counts: IP -> { count, resetTime }
const requestMap = new Map();

// Cleanup interval to remove old entries (every 15 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestMap.entries()) {
    if (data.resetTime < now) {
      requestMap.delete(ip);
    }
  }
}, 15 * 60 * 1000); // 15 minutes

export const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 20;

  const existing = requestMap.get(ip);

  if (!existing || existing.resetTime < now) {
    // First request or window expired - start new window
    requestMap.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return next();
  }

  // Increment count
  existing.count += 1;

  if (existing.count > maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter
    });
  }

  // Allow request
  next();
};






