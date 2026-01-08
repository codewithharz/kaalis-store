// backend/middleware/loggerMiddleware.js
const logger = require("../utils/logger");

// List of sensitive fields to filter from logs
const sensitiveFields = [
  "password",
  "token",
  "refreshToken",
  "authorization",
  "card",
  "cvv",
  "pin",
  "secret",
  "paystackSecretKey",
];

// Function to filter sensitive data
const filterSensitiveData = (data) => {
  if (!data) return data;

  const filtered = { ...data };
  sensitiveFields.forEach((field) => {
    if (field in filtered) {
      filtered[field] = "[FILTERED]";
    }
  });

  Object.keys(filtered).forEach((key) => {
    if (typeof filtered[key] === "object" && filtered[key] !== null) {
      filtered[key] = filterSensitiveData(filtered[key]);
    }
  });

  return filtered;
};

// Combined logging middleware
const loggerMiddleware = (req, res, next) => {
  // Skip logging for health checks or if logging is disabled
  if (
    req.url === "/health" ||
    req.url.startsWith("/metrics") ||
    (process.env.NODE_ENV === "production" &&
      process.env.ENABLE_LOGGING !== "true")
  ) {
    return next();
  }

  const startTime = Date.now();

  try {
    // Log request asynchronously
    setImmediate(() => {
      const requestLog = {
        type: "request",
        method: req.method,
        url: req.url,
        params: filterSensitiveData(req.params),
        query: filterSensitiveData(req.query),
        body: filterSensitiveData(req.body),
        user: req.user ? req.user._id : "Anonymous",
        timestamp: new Date().toISOString(),
      };

      // Special handling for payment requests
      if (req.url.startsWith("/api/payment")) {
        logger.logPaymentEvent("request", requestLog);
      } else {
        logger.info("API Request:", requestLog);
      }
    });

    // Log response
    res.on("finish", () => {
      const duration = Date.now() - startTime;

      setImmediate(() => {
        const responseLog = {
          type: "response",
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: `${duration}ms`,
          user: req.user ? req.user._id : "Anonymous",
        };

        if (res.statusCode >= 400) {
          logger.warn("API Response:", responseLog);
        } else {
          logger.info("API Response:", responseLog);
        }
      });
    });
  } catch (error) {
    logger.error("Logging error:", {
      message: error.message,
      stack: error.stack,
    });
  }

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  try {
    logger.error("API Error:", {
      error: {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        name: err.name,
        code: err.code,
      },
      request: {
        method: req.method,
        url: req.url,
        params: filterSensitiveData(req.params),
        query: filterSensitiveData(req.query),
        body: filterSensitiveData(req.body),
        user: req.user ? req.user._id : "Anonymous",
      },
    });
  } catch (loggingError) {
    console.error("Error logging failed:", loggingError);
  }
  next(err);
};

module.exports = {
  loggerMiddleware,
  errorLogger,
};
