import winston from 'winston';
import { env } from './env.js';

// 1. Custom Format (Smart Logic: Jo hai wahi dikhao)
const customFormat = winston.format.printf((info) => {
  
  // Step A: Wo fields jo HAMESHA dikhenge (Mandatory)
  const logObject = {
    timestamp: info.timestamp,
    level: info.level.toUpperCase(),
    service: 'jasiqlabs-backend',
    env: env.NODE_ENV || 'development',
    message: info.message,
  };

  // Step B: Wo fields jo SIRF tab dikhenge jab data hoga (No Nulls!)
  
  // IDs
  if (info.correlationId) logObject.correlationId = info.correlationId;
  if (info.requestId) logObject.requestId = info.requestId;
  if (info.userId) logObject.userId = info.userId;
  
  // Event Name
  if (info.event) logObject.event = info.event;
  
  // API Details (Method, URL, Status)
  if (info.method) logObject.method = info.method;
  if (info.url) logObject.url = info.url;
  if (info.statusCode) logObject.statusCode = info.statusCode;
  if (info.durationMs) logObject.durationMs = info.durationMs;
  
  // User Info
  if (info.ip) logObject.ip = info.ip;
  if (info.userAgent) logObject.userAgent = info.userAgent;
  
  // Errors
  if (info.stack) logObject.stackTrace = info.stack;

  // Step C: Baki bacha hua data (Metadata) merge karein
  // Hum pehle wale keys ko nikal (destructure) lete hain taaki duplicate na ho
  const { 
    timestamp, level, message, service, env: environment, 
    correlationId, requestId, event, userId, method, url, statusCode, durationMs, ip, userAgent, stack,
    ...metadata 
  } = info;

  // Metadata ko main object me mila do
  Object.assign(logObject, metadata);

  return JSON.stringify(logObject);
});

// 2. Logger Create karte hain
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat // Ye naya format null values ko gayab kar dega
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

export default logger;