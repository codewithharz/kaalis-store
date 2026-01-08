// backend/utils/logger.js
const winston = require("winston");

// Define custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Add colors to Winston
winston.addColors(colors);

// Create format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create the logger with only console transport
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
  // Don't exit on error
  exitOnError: false,
});

// Helper methods for structured logging
logger.logPaymentEvent = (eventType, data) => {
  logger.info({
    event: "payment",
    type: eventType,
    data,
    timestamp: new Date().toISOString(),
  });
};

logger.logPayoutEvent = (eventType, data) => {
  logger.info({
    event: "payout",
    type: eventType,
    data,
    timestamp: new Date().toISOString(),
  });
};

logger.logError = (error, context = {}) => {
  logger.error({
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  });
};

// Stream for compatibility with express middleware
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

module.exports = logger;

// Usage examples:
/*
logger.error('Error occurred during payment processing', { orderId: '123', error: err });
logger.warn('Payment retry attempt', { attempt: 2, orderId: '123' });
logger.info('Payment successful', { orderId: '123', amount: 1000 });
logger.http('Payment API request', { method: 'POST', url: '/api/payments' });
logger.debug('Payment processing details', { payload: {}, response: {} });

logger.logPaymentEvent('initiation', { orderId: '123', amount: 1000 });
logger.logPayoutEvent('batch_processing', { vendorId: '456', payoutCount: 10 });
logger.logError(new Error('Payment failed'), { orderId: '123' });
*/
