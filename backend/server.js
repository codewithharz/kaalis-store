// require("dotenv").config();
const path = require("path");
// require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config(); // Load default environment variables from Vercel
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./utils/db");
const createInitialAdmin = require("./seeders/adminSeeder");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const addressRoutes = require("./routes/addressRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userAuthMiddleware = require("./middleware/userAuthMiddleware");
const couponRoutes = require("./routes/couponRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const reviewRatingRoutes = require("./routes/reviewRatingRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const cluesBucksRoutes = require("./routes/cluesBucksRoutes");
const specialOfferRoutes = require("./routes/specialOfferRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const roleRoutes = require("./routes/roleRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const shippingRulesRoutes = require("./routes/shippingRules");
const paymentRoutes = require("./routes/paymentRoutes");
const paystackRoutes = require("./routes/paystackRoutes");
const orangeMoneyRoutes = require("./routes/orangeMoneyRoutes");
const payoutTestRoutes = require("./routes/payoutTestRoutes");
const opayRoutes = require("./routes/opayRoutes");
const vendorPayoutRoutes = require("./routes/vendorPayoutRoutes");
const { initPayoutCron } = require("./config/cronJobs");
const {
  loggerMiddleware,
  errorLogger,
} = require("./middleware/loggerMiddleware");

const app = express();

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Define allowed origins with environment variable support
    const allowedOrigins = [
      // Development origins
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",

      // Production domains
      "https://www.bruthol.com",
      "https://bruthol.com",

      // Environment variables - handle comma-separated values
      ...(process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
        : []),
      process.env.FRONTEND_URL,
      process.env.VITE_FRONTEND_URL,

      // Vercel deployment patterns
      /^https:\/\/kaalis-store[a-zA-Z0-9-]*\.vercel\.app$/,
      /^https:\/\/[a-zA-Z0-9-]*kaalis[a-zA-Z0-9-]*\.vercel\.app$/,
      /^https:\/\/kaalis-store-[a-zA-Z0-9-]*-[a-zA-Z0-9-]*\.vercel\.app$/,
    ].filter(Boolean); // Remove any undefined values

    console.log("=== CORS CHECK ===");
    console.log("Request origin:", origin);
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Frontend URL env:", process.env.FRONTEND_URL);
    console.log(
      "Allowed origins:",
      allowedOrigins.map((o) => (typeof o === "string" ? o : o.toString()))
    );

    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      console.log(
        "No origin - allowing request (e.g., curl, Postman, mobile app)"
      );
      return callback(null, true);
    }

    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === "string") {
        return allowed === origin;
      } else if (allowed && allowed.test) {
        return allowed.test(origin);
      }
      return false;
    });

    console.log("Origin allowed:", isAllowed);
    console.log("==================");

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error("CORS Error - Origin blocked:", origin);
      console.error("Available origins:", allowedOrigins);

      // In development, be more permissive
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode - allowing origin anyway");
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["set-cookie"],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Enhanced global error handler
app.use((err, req, res, next) => {
  console.error("=== GLOBAL ERROR HANDLER ===");
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  console.error("Request URL:", req.url);
  console.error("Request Method:", req.method);
  console.error("Request Origin:", req.headers.origin);
  console.error("User Agent:", req.headers["user-agent"]);
  console.error(
    "Authorization Header:",
    req.headers.authorization ? "Present" : "Missing"
  );
  console.error("============================");

  const statusCode = err.status || err.statusCode || 500;

  // Different responses for development vs production
  if (process.env.NODE_ENV === "production") {
    // Production error response - don't leak sensitive info
    res.status(statusCode).json({
      status: "error",
      message: statusCode === 500 ? "Internal server error" : err.message,
      code: statusCode,
      timestamp: new Date().toISOString(),
    });
  } else {
    // Development error response - include details
    res.status(statusCode).json({
      status: "error",
      message: err.message,
      code: statusCode,
      stack: err.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected");
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Additional CORS headers for complex requests
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Set CORS headers manually as backup
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).send();
    return;
  }

  next();
});

// Validate environment variables
const deployKey = process.env.ADMIN_DEPLOYMENT_KEY;
if (!deployKey) {
  console.warn("ADMIN_DEPLOYMENT_KEY not found in environment");
}

// Log important environment variables (without exposing secrets)
console.log("=== ENVIRONMENT CHECK ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT || 7788);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "Not set");
console.log("DATABASE Connected:", "Will check after connection");
console.log("=========================");

// Connect to database and initialize admin
const initializeApp = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    await createInitialAdmin();
    console.log("✅ Admin initialization complete");

    console.log("🚀 App initialization complete");
  } catch (error) {
    console.error("❌ Failed to initialize app:", error);

    // In production, we might want to exit if initialization fails
    if (process.env.NODE_ENV === "production") {
      console.error("Exiting due to initialization failure in production");
      process.exit(1);
    }
  }
};

// Initialize app
initializeApp();

// Add after CORS and before routes
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    status: "error",
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

// Apply logger middleware
app.use(loggerMiddleware);

// Enhanced health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: {
      origin: req.headers.origin || "no-origin",
      allowed: true,
    },
    database: "connected", // You might want to add actual DB health check
    version: "1.0.0",
  });
});

// Test endpoint for CORS verification
app.get("/api/cors-test", (req, res) => {
  res.json({
    message: "CORS is working correctly",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// Special handling for Paystack webhook
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  require("./middleware/paystackWebhook"),
  (req, res) => {
    // If paystackRoutes is a router, handle it as middleware
    if (typeof paystackRoutes === "function") {
      paystackRoutes(req, res);
    } else {
      // If it's an object with handlers, find the appropriate handler
      // For example, if it has a webhook method:
      if (paystackRoutes.webhook) {
        paystackRoutes.webhook(req, res);
      } else {
        // Default fallback
        res
          .status(200)
          .json({ status: "success", message: "Webhook received" });
      }
    }
  }
);

// Routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/products", productRoutes); // Protected product routes
app.use("/api/categories", categoryRoutes); // Category routes
app.use("/api/activity-logs", userAuthMiddleware, activityLogRoutes); // Activity log routes
app.use("/api/addresses", userAuthMiddleware, addressRoutes); // Address routes
app.use("/api/admin", adminUserRoutes); // Admin user routes
app.use("/api/admin-notifications", adminNotificationRoutes); // Admin notification routes
app.use("/api/audit-logs", auditLogRoutes); // Audit log routes
app.use("/api/cart", cartRoutes); // Cart routes
app.use("/api/coupons", couponRoutes); // Coupon routes
app.use("/api/interactions", interactionRoutes); // interaction routes
app.use("/api/review-ratings", reviewRatingRoutes); // Review Rating routes
app.use("/api/feedbacks", feedbackRoutes); // Feedback routes
app.use("/api/inventories", inventoryRoutes); // Inventory inventory routes
app.use("/api/cluesbucks", cluesBucksRoutes); // CluesBucks routes
app.use("/api/special-offers", specialOfferRoutes); //special Offer routes
app.use("/api/orders", orderRoutes); // Order inventory routes
app.use("/api/reports", reportRoutes); // Reports inventory routes roleRoutes
app.use("/api/roles", roleRoutes); // Roles inventory routes
app.use("/api/shipments", shipmentRoutes); // Shipment inventory routes
app.use("/api/wishlists", wishlistRoutes); // wishlist inventory routes
app.use("/api/notifications", notificationRoutes); // Notification inventory routes
app.use("/api/messages", messageRoutes); // Message inventory routes
app.use("/api/seller", sellerRoutes); // seller inventory routes
app.use("/api/shipping-rules", shippingRulesRoutes);
app.use("/api/payment", paymentRoutes); // Includes Paystack and PayDunya routes
app.use("/api/paystack", paystackRoutes); // Paystack routes
app.use("/api/orange-money", orangeMoneyRoutes); // Orange Money routes
app.use("/api/opay", opayRoutes);
app.use("/api/vendor-payout", vendorPayoutRoutes); // Vendor payout routes

// Only enable test routes in development or test environment
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  // Make sure all required middlewares are defined
  app.use("/api/payout-test", payoutTestRoutes);
  console.log("✅ Payout test routes enabled in development mode");
}

// Apply rate limiting to admin login
app.use("/api/admin/login", adminLoginLimiter);

// Initialize cron jobs
try {
  initPayoutCron();
  console.log("✅ Payout cron job initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize payout cron:", error);
}

// Error handling middleware
app.use(errorLogger);

// Enhanced global error handler
app.use((err, req, res, next) => {
  console.error("=== GLOBAL ERROR HANDLER ===");
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  console.error("Request URL:", req.url);
  console.error("Request Method:", req.method);
  console.error("Request Origin:", req.headers.origin);
  console.error("============================");

  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    status: "error",
    message,
    code: err.code || statusCode,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      url: req.url,
      method: req.method,
    }),
  });
});

// Add this with your other route registrations
if (process.env.NODE_ENV === "development") {
  const demoPaymentRoutes = require("./routes/demoPaymentRoutes");
  app.use("/demo", demoPaymentRoutes);
  console.log("✅ Demo payment routes enabled");
}

// Enhanced 404 handler
app.use((req, res) => {
  console.log("=== 404 NOT FOUND ===");
  console.log("Path:", req.path);
  console.log("Method:", req.method);
  console.log("Origin:", req.headers.origin);
  console.log("====================");

  res.status(404).json({
    status: "error",
    message: "Resource not found",
    path: req.path,
    method: req.method,
    availableEndpoints: [
      "GET /api/health",
      "GET /api/cors-test",
      "POST /api/users/login",
      "GET /api/products",
      "GET /api/categories",
    ],
  });
});

const PORT = process.env.PORT || 7788;

// Start server
const server = app.listen(PORT, () => {
  console.log("🚀=========================🚀");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🚀 CORS test: http://localhost:${PORT}/api/cors-test`);
  console.log("🚀=========================🚀");
});

// Enhanced process error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise);
  console.error("❌ Reason:", reason);

  // Close server & exit process
  server.close(() => {
    console.log("Server closed due to unhandled rejection");
    process.exit(1);
  });
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);

  // Close server & exit process
  server.close(() => {
    console.log("Server closed due to uncaught exception");
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;
