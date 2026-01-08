// backend/middleware/performanceMiddleware.js
const PerformanceMetric = require("../models/performanceMetricModels");

const performanceMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    // Log performance metrics
    PerformanceMetric.create({
      endpoint: req.path,
      method: req.method,
      duration,
      timestamp: new Date(),
      statusCode: res.statusCode,
      userAgent: req.get("user-agent"),
    }).catch((err) => console.error("Performance metric error:", err));
  });

  next();
};

module.exports = performanceMiddleware;
