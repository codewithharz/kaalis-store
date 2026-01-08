lemme show you how we made the paystack worked, maybe from there you'd know how to connect the Orange money:

// require("dotenv").config();
const path = require("path");
require("dotenv").config({ path: path.join(\_\_dirname, ".env") });
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
const allowedOrigins = [
"http://localhost:5173",
"http://127.0.0.1:5173",
/^https:\/\/kaalis-store[a-zA-Z0-9-]\*.vercel.app$/, // More specific regex for Vercel URLs
];

    // Allow requests with no origin (like mobile apps, curl requests, etc)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some((allowed) =>
      typeof allowed === "string" ? allowed === origin : allowed.test(origin)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("Origin blocked by CORS:", origin);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
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
maxAge: 86400,
};

const deployKey = process.env.ADMIN_DEPLOYMENT_KEY;
if (!deployKey) {
console.warn("ADMIN_DEPLOYMENT_KEY not found in environment");
}

// Add this before applying the CORS middleware
app.use((req, res, next) => {
console.log("Incoming request:", {
origin: req.headers.origin,
method: req.method,
path: req.path,
});
next();
});

// Apply CORS middleware
app.use(cors(corsOptions));
app.options("\*", cors(corsOptions));

// Connect to database and initialize admin
const initializeApp = async () => {
try {
await connectDB();
await createInitialAdmin(); // This will handle both dev and prod environments
console.log("Database and admin initialization complete");
} catch (error) {
console.error("Failed to initialize app:", error);
// In production, we might want to exit if initialization fails
if (process.env.NODE_ENV === "production") {
process.exit(1);
}
}
};

// Initialize app
initializeApp();

// Add after CORS and before routes
const adminLoginLimiter = rateLimit({
windowMs: 15 _ 60 _ 1000, // 15 minutes
max: 5, // 5 attempts
message: {
status: "error",
message: "Too many login attempts, please try again after 15 minutes",
},
});

// Basic middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

// Apply logger middleware
app.use(loggerMiddleware);

// Health check endpoint
app.get("/api/health", (req, res) => {
res.json({
status: "ok",
timestamp: new Date().toISOString(),
environment: process.env.NODE_ENV,
});
});

// Special handling for Paystack webhook
app.post(
"/api/payment/webhook",
express.raw({ type: "application/json" }),
require("./middleware/paystackWebhook"),
paystackRoutes
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
app.use("/api/messages", messageRoutes);
app.use("/api/seller", sellerRoutes); // seller inventory routes
app.use("/api/shipping-rules", shippingRulesRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment", paystackRoutes);
app.use("/api/vendor-payout", vendorPayoutRoutes);

app.use("/api/admin/login", adminLoginLimiter);
// Initialize cron jobs
try {
initPayoutCron();
console.log("Payout cron job initialized successfully");
} catch (error) {
console.error("Failed to initialize payout cron:", error);
}

// Error handling middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
const statusCode = err.status || 500;
const message =
process.env.NODE_ENV === "production"
? "Internal server error"
: err.message;

res.status(statusCode).json({
status: "error",
message,
code: err.code || statusCode,
...(process.env.NODE_ENV === "development" && { stack: err.stack }),
});
});

// 404 handler
app.use((req, res) => {
res.status(404).json({
status: "error",
message: "Resource not found",
path: req.path,
});
});

const PORT = process.env.PORT || 7787;

// Start server
const server = app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

// Handle process errors
process.on("unhandledRejection", (reason, promise) => {
console.error("Unhandled Rejection:", reason);
// Close server & exit process
server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
console.error("Uncaught Exception:", error);
// Close server & exit process
server.close(() => process.exit(1));
});

module.exports = app;

// backend/utils/paymentUtils.js
const VENDOR_SHARE_PERCENTAGE = 0.92; // 92% for vendor
const PLATFORM_FEE_PERCENTAGE = 0.08; // 8% platform fee
const DECIMAL_PLACES = 2;

/\*\*

- Calculate vendor and platform fees from total amount with precision handling
- @param {number} amount - Total amount in base currency units
- @returns {Object} Object containing vendorAmount, platformFee, and total
  \*/
  exports.calculateFees = (amount) => {
  // Convert amount to number and ensure it's positive with 2 decimal precision
  const safeAmount = parseFloat(
  Math.abs(Number(amount)).toFixed(DECIMAL_PLACES)
  );

// Calculate amounts with higher precision to avoid rounding issues
const vendorAmount = parseFloat(
(safeAmount _ VENDOR_SHARE_PERCENTAGE).toFixed(DECIMAL_PLACES)
);
const platformFee = parseFloat(
(safeAmount _ PLATFORM_FEE_PERCENTAGE).toFixed(DECIMAL_PLACES)
);

// Check for and handle rounding discrepancies
const calculatedTotal = vendorAmount + platformFee;
const difference = parseFloat(
(safeAmount - calculatedTotal).toFixed(DECIMAL_PLACES)
);

return {
vendorAmount: vendorAmount + difference, // Add any difference to vendor amount
platformFee,
total: safeAmount,
originalAmount: amount,
};
};

/\*\*

- Validate payment amounts with tolerance for floating-point arithmetic
- @param {number} amount - Total amount
- @param {number} vendorAmount - Vendor's portion
- @param {number} platformFee - Platform's fee
- @returns {boolean} True if amounts match within acceptable tolerance
  \*/
  exports.validatePaymentAmount = (amount, vendorAmount, platformFee) => {
  // Use small epsilon for floating point comparison
  const EPSILON = 0.00001;

const total = parseFloat(amount.toFixed(DECIMAL_PLACES));
const sum = parseFloat((vendorAmount + platformFee).toFixed(DECIMAL_PLACES));

return Math.abs(total - sum) < EPSILON;
};

/\*\*

- Convert amount to Paystack's kobo format with validation
- @param {number} amount - Amount in Naira
- @returns {number} Amount in kobo
- @throws {Error} If amount is invalid
  _/
  exports.toKobo = (amount) => {
  if (isNaN(amount) || amount < 0) {
  throw new Error("Invalid amount provided");
  }
  return Math.round(parseFloat(amount) _ 100);
  };

/\*\*

- Convert amount from Paystack's kobo format to Naira
- @param {number} amount - Amount in kobo
- @returns {number} Amount in Naira
- @throws {Error} If amount is invalid
  \*/
  exports.fromKobo = (amount) => {
  if (isNaN(amount) || amount < 0) {
  throw new Error("Invalid kobo amount provided");
  }
  return parseFloat((amount / 100).toFixed(DECIMAL_PLACES));
  };

/\*\*

- Calculate transaction amounts including fees
- @param {number} baseAmount - Base amount before fees
- @param {number} shippingFee - Shipping fee amount
- @returns {Object} Calculated amounts including fees
  \*/
  exports.calculateTransactionAmounts = (baseAmount, shippingFee = 0) => {
  const subTotal = parseFloat(baseAmount.toFixed(DECIMAL_PLACES));
  const shipping = parseFloat(shippingFee.toFixed(DECIMAL_PLACES));
  const totalBeforeFees = subTotal + shipping;

const { vendorAmount, platformFee } = exports.calculateFees(subTotal);

return {
subTotal,
shippingFee: shipping,
vendorAmount,
platformFee: platformFee + shipping, // Platform keeps shipping fee
total: totalBeforeFees,
totalInKobo: exports.toKobo(totalBeforeFees),
};
};

/\*\*

- Validate Paystack payment amounts
- @param {Object} amounts - Object containing payment amounts
- @returns {boolean} True if amounts are valid
  \*/
  exports.validatePaystackAmounts = (amounts) => {
  const { amount, vendorAmount, platformFee, shippingFee = 0 } = amounts;

// All amounts should be positive numbers
const validAmounts = [amount, vendorAmount, platformFee, shippingFee].every(
(amt) => typeof amt === "number" && amt >= 0
);

if (!validAmounts) return false;

// Validate total equals sum of vendor amount and platform fee
return exports.validatePaymentAmount(
amount,
vendorAmount,
platformFee + shippingFee
);
};

/\*\*

- Format amount for display
- @param {number} amount - Amount to format
- @param {string} currency - Currency code (default: NGN)
- @returns {string} Formatted amount string
  \*/
  exports.formatAmount = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  minimumFractionDigits: DECIMAL_PLACES,
  }).format(amount);
  };

/\*\*

- Generate payment reference
- @param {string} prefix - Reference prefix
- @returns {string} Unique payment reference
  \*/
  exports.generatePaymentReference = (prefix = "PAY") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}`;
  };

// backend/utils/db.js
const mongoose = require("mongoose");
require("dotenv").config();

let cachedConnection = null;
let indexSyncInProgress = false;

const connectDB = async () => {
if (cachedConnection) {
console.log("Using cached MongoDB connection");
return cachedConnection;
}

try {
mongoose.set("strictQuery", true);

    // Enhanced connection options
    const options = {
      serverSelectionTimeoutMS: 60000, // 1 minute
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      autoIndex: false, // Disable automatic indexing
      retryWrites: true,
      w: "majority",
      family: 4, // Force IPv4
      connectTimeoutMS: 60000,
      heartbeatFrequencyMS: 10000,
    };

    console.log("Attempting to connect to MongoDB...");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI?.substring(0, 20) + "..."
    ); // Log partial URI for debugging

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    cachedConnection = conn;

    // Log connection success
    console.log("MongoDB Connected:", {
      host: conn.connection.host,
      database: conn.connection.name,
      state: ["disconnected", "connected", "connecting", "disconnecting"][
        conn.connection.readyState
      ],
    });

    // Handle indexes after connection is established
    if (!indexSyncInProgress) {
      indexSyncInProgress = true;
      setTimeout(() => {
        syncIndexes(conn).catch((err) => {
          console.warn("Index sync warning:", err.message);
          indexSyncInProgress = false;
        });
      }, 15000);
    }

    return conn;

} catch (error) {
console.error("MongoDB Connection Error Details:", {
message: error.message,
code: error.code,
name: error.name,
// stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
});

    cachedConnection = null;
    throw error;

}
};

// Separate function to handle index synchronization
async function syncIndexes(conn) {
try {
const Payment = require("../models/paymentModels");
const Category = require("../models/categoryModels");

    // Create indexes without dropping
    await Promise.all([
      Payment.collection.createIndex(
        { reference: 1 },
        {
          sparse: true,
          background: true,
          name: "reference_sparse",
          timeout: 60000,
        }
      ),
      Category.collection.createIndex(
        { name: 1 },
        {
          background: true,
          timeout: 60000,
        }
      ),
    ]);

    console.log("Indexes synchronized successfully");

} catch (error) {
console.warn("Index synchronization warning:", error.message);
} finally {
indexSyncInProgress = false;
}
}

// Connection event handlers
mongoose.connection.on("error", (err) => {
console.error("MongoDB error:", err);
cachedConnection = null;
});

mongoose.connection.on("disconnected", () => {
console.log("MongoDB disconnected");
cachedConnection = null;
});

// Graceful shutdown
process.on("SIGINT", async () => {
try {
if (mongoose.connection.readyState === 1) {
await mongoose.connection.close();
console.log("MongoDB disconnected through app termination");
}
process.exit(0);
} catch (err) {
console.error("Error during shutdown:", err);
process.exit(1);
}
});

module.exports = connectDB;

// backend/utils/paystackService.js
const axios = require("axios");
const logger = require("../utils/logger");
const Payment = require("../models/paymentModels");
const Order = require("../models/orderModels");
const User = require("../models/userModels");
require("dotenv").config();

class PaystackService {
constructor() {
this.secretKey = process.env.PAYSTACK_SECRET_KEY;
if (!this.secretKey) {
logger.error("PAYSTACK_SECRET_KEY not found in environment variables");
throw new Error("Paystack secret key not configured");
}

    this.baseUrl = "https://api.paystack.co";
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
      maxRetries: 3,
    });

    // Log initialization (but not the secret key)
    logger.info("PaystackService initialized");

}

async initializeTransaction(paymentData) {
try {
const order = await Order.findById(paymentData.metadata.orderId);
if (!order) throw new Error("Order not found");

      logger.info("Initializing Paystack transaction", {
        email: paymentData.email,
        amount: order.totalAmount,
        orderId: order._id,
      });

      // Ensure amount is in kobo and is an integer
      const amountInKobo = Math.round(order.totalAmount * 100); // Convert to kobo

      const payload = {
        email: paymentData.email,
        amount: amountInKobo,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: {
          orderId: order._id,
          userId: paymentData.metadata.userId,
          userEmail: paymentData.email,
          customerName: paymentData.metadata.customerName,
          custom_fields: paymentData.metadata.custom_fields,
        },
      };

      // Only add split if vendor Sub-account Code is provided
      if (paymentData.metadata?.vendorSubaccountCode) {
        payload.split = {
          type: "percentage",
          bearer_type: "account",
          subaccounts: [
            {
              subaccount: paymentData.metadata.vendorSubaccountCode,
              share: 92,
            },
          ],
        };
      }

      return await this.retryRequest(() =>
        this.axios.post("/transaction/initialize", payload)
      );
    } catch (error) {
      logger.error("Transaction initialization failed:", error);
      throw error;
    }

}

async tokenizeCard(data) {
try {
logger.info("Tokenizing card data:", {
expiryMonth: data.expiryMonth,
expiryYear: data.expiryYear,
email: data.email,
last4: data.number.slice(-4),
});

      // First attempt card validation
      const payload = {
        email: data.email,
        card: {
          number: data.number,
          cvv: data.cvv,
          expiry_month: data.expiryMonth,
          expiry_year: data.expiryYear,
        },
      };

      logger.info("Sending payload to Paystack:", {
        ...payload,
        card: { ...payload.card, number: "****" + data.number.slice(-4) },
      });

      // First attempt card validation
      const response = await this.axios.post("/charge/tokenize", payload);

      if (!response.data.status) {
        logger.error("Paystack tokenization failed:", response.data);
        throw new Error(response.data.message || "Card tokenization failed");
      }

      logger.info("Card tokenized successfully:", {
        card_type: response.data.data.card_type,
        last4: response.data.data.last4,
      });

      return {
        token: response.data.data.authorization_code,
        card_type: response.data.data.card_type,
        bin: response.data.data.bin,
        last4: response.data.data.last4,
        exp_month: response.data.data.exp_month,
        exp_year: response.data.data.exp_year,
        channel: response.data.data.channel,
        // card_type: response.data.data.card_type,
        bank: response.data.data.bank,
        country_code: response.data.data.country_code,
      };
    } catch (error) {
      logger.error("Error in tokenizeCard:", {
        error: error.message,
        response: error.response?.data, // Log full Paystack error response
        stack: error.stack,
      });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Could not tokenize card");
    }

}

async verifyTransaction(reference) {
try {
const response = await this.axios.get(`/transaction/verify/${reference}`);
const transactionData = response.data.data;

      if (response.data.status && transactionData.status === "success") {
        const order = await Order.findById(transactionData.metadata.orderId);
        if (!order) throw new Error("Order not found");

        // This is where payment should be recorded
        const payment = await this.recordPayment(transactionData, order);
        await this.updateOrderStatus(order, reference);

        logger.info("Transaction verified successfully", { reference });
        return { success: true, data: payment };
      }

      return { success: false };
    } catch (error) {
      logger.error("Transaction verification error:", {
        reference,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }

}

async recordPayment(transactionData, order) {
const payment = new Payment({
orderId: order.\_id,
reference: transactionData.reference,
amount: order.totalAmount,
email: transactionData.customer.email,
status: "success",
paymentMethod: order.paymentMethod,
metadata: {
userId: order.user,
userEmail: transactionData.customer.email,
},
currency: "NGN",
paystackData: transactionData,
});

    return payment.save();

}

async updateOrderStatus(order, reference) {
order.status = "Processing";
order.transactionId = reference;
return order.save();
}

async retryRequest(requestFn, maxRetries = 3) {
let lastError;
for (let i = 0; i < maxRetries; i++) {
try {
const response = await requestFn();
if (response.data?.status) return response.data;
throw new Error(response.data?.message || "Request failed");
} catch (error) {
lastError = error;
await new Promise((resolve) =>
setTimeout(resolve, Math.pow(2, i) \* 1000)
);
}
}
throw lastError;
}

async verifyBankAccount(data) {
try {
logger.info("Verifying bank account:", {
accountNumber: data.accountNumber,
bankCode: data.bankCode,
});

      const response = await this.axios.get(
        `/bank/resolve?account_number=${data.accountNumber}&bank_code=${data.bankCode}`
      );

      if (!response.data.status) {
        throw new Error(response.data.message || "Could not verify account");
      }

      logger.info("Bank account verified successfully:", {
        accountName: response.data.data.account_name,
      });

      return response.data;
    } catch (error) {
      logger.error("Error verifying bank account:", {
        error: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      // Handle specific Paystack error messages
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error("Could not verify bank account");
    }

}

async createTransferRecipient(data) {
try {
// Input validation
if (
!data.name ||
!data.accountNumber ||
!data.bankCode ||
!data.sellerId
) {
throw new Error("Missing required fields");
}

      // Validate account number format
      if (!/^\d{10}$/.test(data.accountNumber)) {
        throw new Error("Invalid account number format");
      }

      // Validate bank code format
      if (!/^\d{3}$/.test(data.bankCode)) {
        throw new Error("Invalid bank code format");
      }

      logger.info("Verifying account details:", {
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
      });

      // First verify account number with better error handling
      try {
        const verifyResponse = await this.axios.get(
          `/bank/resolve?account_number=${data.accountNumber}&bank_code=${data.bankCode}`
        );

        if (!verifyResponse.data.status) {
          throw new Error(
            verifyResponse.data.message || "Could not verify account"
          );
        }

        // Log successful verification
        logger.info("Account verified successfully:", {
          accountName: verifyResponse.data.data.account_name,
          accountNumber: data.accountNumber,
        });

        // Create transfer recipient with verified account name
        const response = await this.axios.post("/transferrecipient", {
          type: "nuban",
          name: verifyResponse.data.data.account_name,
          account_number: data.accountNumber,
          bank_code: data.bankCode,
          currency: "NGN",
          metadata: {
            sellerId: data.sellerId,
          },
        });

        if (!response.data.status) {
          throw new Error(
            response.data.message || "Failed to create transfer recipient"
          );
        }

        // Update user model with recipient code and verified details
        await User.findByIdAndUpdate(data.sellerId, {
          "paystack.recipientCode": response.data.data.recipient_code,
          "paystack.accountNumber": data.accountNumber,
          "paystack.bankCode": data.bankCode,
          "paystack.accountName": verifyResponse.data.data.account_name,
        });

        return response.data;
      } catch (error) {
        // Handle Paystack API specific errors
        if (error.response?.data?.message) {
          logger.error("Paystack API error:", {
            message: error.response.data.message,
            code: error.response.data.code,
            accountNumber: data.accountNumber,
            bankCode: data.bankCode,
          });
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    } catch (error) {
      logger.error("Error in createTransferRecipient:", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }

}

async initiateTransfer({ amount, recipient, reason }) {
try {
logger.info(
`Initiating transfer: Amount=${amount}, Recipient=${recipient}, Reason=${reason}`
);

      const response = await this.axios.post("/transfer", {
        source: "balance",
        amount,
        recipient,
        reason,
      });

      if (!response.data.status) {
        throw new Error(response.data.message || "Transfer initiation failed");
      }

      logger.info(
        `Transfer initiated successfully: ${response.data.data.reference}`
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Paystack transfer initiation failed:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || error.message);
    }

}

// Mock method for testing without real API calls
async mockInitiateTransfer({ amount, recipient, reason }) {
try {
logger.info(
`Mock transfer: Amount=${amount}, Recipient=${recipient}, Reason=${reason}`
);

      // Validate input
      if (!amount || !recipient || !reason) {
        throw new Error("Missing required transfer parameters");
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        status: true,
        data: {
          reference: `mock_transfer_${Date.now()}`,
          integration: 100073,
          domain: "test",
          amount: amount,
          currency: "NGN",
          source: "balance",
          reason: reason,
          recipient: recipient,
          status: "success",
          transfer_code: `TRF_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          id: Date.now(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    } catch (error) {
      logger.error("Mock transfer failed:", error.message);
      throw error;
    }

}
}

module.exports = PaystackService;

const logger = require("../utils/logger");
const PaystackService = require("./paystackService");
const VendorPayout = require("../models/vendorPayoutModels");
const User = require("../models/userModels");
const payoutConfig = require("../config/payoutConfig");
const NotificationService = require("../services/notificationService");

class PayoutService {
constructor() {
this.paystackService = new PaystackService();
this.notificationService = new NotificationService();
}

async processVendorPayouts() {
logger.info("Starting automated payout processing");

    try {
      const pendingPayouts = await this.getPendingPayouts();
      const vendorPayouts = this.groupPayoutsByVendor(pendingPayouts);
      await this.processBatchPayouts(vendorPayouts);
      await this.cleanupOldPayouts();

      logger.info("Completed payout processing");
    } catch (error) {
      logger.error("Error in payout processing:", error);
      await this.sendAdminAlert("Payout Processing Error", error.message);
    }

}

async getPendingPayouts() {
const payouts = await VendorPayout.find({
status: "pending",
scheduledDate: { $lte: new Date() },
}).populate("vendorId", "email paystack monthlyVolume");

    logger.info(`Found ${payouts.length} pending payouts to process`);
    return payouts;

}

async scheduleVendorPayout(vendorId, amount, orderData) {
try {
const vendorTier = await this.getVendorTier(vendorId);
const tierConfig = payoutConfig.schedules[vendorTier];

      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + tierConfig.holdingPeriod);

      // Check if there's an existing small payout to aggregate
      const existingPayout = await this.findExistingSmallPayout(vendorId);

      if (existingPayout) {
        return await this.aggregateWithExistingPayout(existingPayout, amount);
      }

      if (amount >= tierConfig.minimumAmount) {
        const payout = new VendorPayout({
          vendorId,
          amount,
          scheduledDate,
          status: "pending",
          tier: vendorTier,
          feeStructure: payoutConfig.fees[vendorTier],
          metadata: {
            orderId: orderData.orderId,
            customerEmail: orderData.customerEmail,
          },
        });

        await payout.save();

        if (payoutConfig.notifications.notifyBeforePayout) {
          await this.notificationService.sendPayoutScheduledNotification(
            vendorId,
            {
              amount,
              scheduledDate,
              tier: vendorTier,
            }
          );
        }

        return payout;
      } else {
        return await this.createSmallPayout(vendorId, amount, tierConfig);
      }
    } catch (error) {
      logger.error("Error scheduling vendor payout:", error);
      throw error;
    }

}

async findExistingSmallPayout(vendorId) {
return await VendorPayout.findOne({
vendorId,
status: "aggregating",
amount: { $lt: payoutConfig.schedules.default.minimumAmount },
});
}

async aggregateWithExistingPayout(existingPayout, newAmount) {
const vendorTier = await this.getVendorTier(existingPayout.vendorId);
const tierConfig = payoutConfig.schedules[vendorTier];

    existingPayout.amount += newAmount;

    if (existingPayout.amount >= tierConfig.minimumAmount) {
      existingPayout.status = "pending";
      existingPayout.scheduledDate = new Date();
      existingPayout.scheduledDate.setDate(
        existingPayout.scheduledDate.getDate() + tierConfig.holdingPeriod
      );
    }

    return await existingPayout.save();

}

async createSmallPayout(vendorId, amount, tierConfig) {
const payout = new VendorPayout({
vendorId,
amount,
status: "aggregating",
scheduledDate: new Date(),
tier: await this.getVendorTier(vendorId),
feeStructure: payoutConfig.fees[tierConfig],
});

    return await payout.save();

}

groupPayoutsByVendor(payouts) {
return payouts.reduce((acc, payout) => {
if (!acc[payout.vendorId._id]) {
acc[payout.vendorId._id] = {
vendor: payout.vendorId,
payouts: [],
tier: payout.tier,
};
}
acc[payout.vendorId._id].payouts.push(payout);
return acc;
}, {});
}

async updatePayoutStatus(payout, transfer) {
payout.status = "processing";
payout.transferReference = transfer.data.reference;
payout.lastProcessedAt = new Date();
await payout.save();
}

async updateVendorStats(vendorId) {
await User.findByIdAndUpdate(vendorId, {
$inc: {
"paystack.totalPayouts": 1,
monthlyPayoutCount: 1,
},
$set: { "paystack.lastPayout": new Date() },
});
}

async handleFailedPayouts(payouts, error) {
await Promise.all(
payouts.map((payout) => this.handleFailedPayout(payout, error))
);
}

async handleFailedPayout(payout, error) {
const retryConfig = payoutConfig.retryStrategy;
const shouldRetry = payout.retriesCount < retryConfig.maxAttempts;

    const update = {
      status: shouldRetry ? "pending" : "failed",
      errorMessage: error.message,
      $inc: { retriesCount: 1 },
    };

    if (shouldRetry) {
      const delayHours = retryConfig.delays[payout.retriesCount];
      update.scheduledDate = new Date(Date.now() + delayHours * 60 * 60 * 1000);
    }

    await VendorPayout.findByIdAndUpdate(payout._id, update);

    if (shouldRetry && payoutConfig.notifications.notifyOnFailure) {
      await this.notificationService.sendPayoutFailureNotification(
        payout.vendorId,
        {
          amount: payout.amount,
          nextRetry: update.scheduledDate,
          error: error.message,
        }
      );
    }

}

// notification method for missing payment setup
async notifyVendorForPaymentSetup(vendorId) {
try {
await this.notificationService.sendPaymentSetupReminder(vendorId);
logger.info(`Sent payment setup reminder to vendor ${vendorId}`);
} catch (error) {
logger.error(
`Failed to send payment setup reminder to vendor ${vendorId}:`,
error
);
}
}

// Add summary reporting
async generatePayoutSummary(results) {
const summary = {
totalProcessed: results.length,
successful: results.filter((r) => r.status === "fulfilled").length,
failed: results.filter((r) => r.status === "rejected").length,
totalAmount: results.reduce(
(sum, r) => (r.status === "fulfilled" ? sum + r.value.amount : sum),
0
),
};

    logger.info("Payout processing summary:", summary);
    return summary;

}

async cleanupOldPayouts() {
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await VendorPayout.deleteMany({
      status: "processed",
      processedAt: { $lt: thirtyDaysAgo },
    });

}

async sendAdminAlert(subject, message) {
try {
logger.error(`Admin Alert - ${subject}: ${message}`);
await this.notificationService.sendAdminAlert(subject, message);
} catch (error) {
logger.error("Failed to send admin alert:", error);
}
}

// Helper method for calculating vendor amounts
calculateVendorAmount(order, vendorTier = "default") {
try {
const totalAmount = order.totalAmount || 0;
const vendorShare = payoutConfig.fees[vendorTier].vendorShare;
const vendorAmount = totalAmount \* vendorShare;

      return Math.floor(vendorAmount);
    } catch (error) {
      logger.error(
        `Error calculating vendor amount for order ${order._id}:`,
        error
      );
      return 0;
    }

}

async processVendorBatch(vendorId, { vendor, payouts }) {
if (!vendor.paystack?.recipientCode) {
logger.warn(
`Vendor ${vendorId} has no recipient code. Skipping payouts.`
);
await this.notifyVendorForPaymentSetup(vendorId);
return;
}

    try {
      const results = {
        processed: 0,
        failed: 0,
        skipped: 0,
      };

      for (const payout of payouts) {
        try {
          const transfer = await this.initiateVendorTransfer(vendor, payout);

          if (transfer.status) {
            await this.updateSuccessfulPayout(payout, transfer);
            results.processed++;
          } else {
            await this.handleFailedPayout(payout, new Error("Transfer failed"));
            results.failed++;
          }
        } catch (error) {
          await this.handleFailedPayout(payout, error);
          results.failed++;
        }
      }

      logger.info(`Batch processing results for vendor ${vendorId}:`, results);
      return results;
    } catch (error) {
      logger.error(`Error processing batch for vendor ${vendorId}:`, error);
      throw error;
    }

}

async processBatchPayouts(vendorPayouts) {
for (const vendorId in vendorPayouts) {
const vendorBatch = vendorPayouts[vendorId];
const batchSize = payoutConfig.schedules[vendorBatch.tier].batchSize;

      // Split into smaller batches if needed
      for (let i = 0; i < vendorBatch.payouts.length; i += batchSize) {
        const batchPayouts = vendorBatch.payouts.slice(i, i + batchSize);
        await this.processVendorBatch(vendorId, {
          vendor: vendorBatch.vendor,
          payouts: batchPayouts,
        });
      }
    }

}

async getVendorTier(vendorId) {
const vendor = await User.findById(vendorId).select(
"monthlyVolume lastPayout"
);

    // Calculate monthly volume and determine tier
    if (vendor.monthlyVolume >= 1000000) {
      // 1 million threshold
      return "premium";
    }
    return "default";

}

async initiateVendorTransfer(vendor, payout) {
try {
if (!vendor.paystack?.recipientCode) {
throw new Error(
`No valid Paystack recipient code for vendor ${vendor._id}`
);
}

      const transfer = await this.paystackService.initiateTransfer({
        amount: Math.floor(payout.amount * 100), // Convert to kobo
        recipient: vendor.paystack.recipientCode,
        reason: `Payout ${payout._id}`,
      });

      return transfer;
    } catch (error) {
      logger.error(
        `Transfer initiation failed for vendor ${vendor._id}:`,
        error
      );
      throw error;
    }

}

async updateSuccessfulPayout(payout, transfer) {
await Promise.all([
VendorPayout.findByIdAndUpdate(payout._id, {
status: "processing",
transferReference: transfer.data.reference,
$inc: { retriesCount: 1 },
}),
Order.findByIdAndUpdate(payout.orderId, {
payoutStatus: "processed",
lastPayoutDate: new Date(),
lastPayoutId: payout._id,
}),
]);
}
}

module.exports = new PayoutService();

// backend/scripts/migratePaymentModels.js
// Migration script (backend/scripts/migratePaymentModels.js)
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const VendorPayout = require("../models/VendorPayout");

async function migratePayments() {
try {
const payments = await Payment.find({});

    for (const payment of payments) {
      // Add new fields with default values
      payment.vendorAmount = payment.amount * 0.92; // 92% for vendor
      payment.platformFee = payment.amount * 0.08; // 8% platform fee
      payment.reference = payment.transactionId || `MIGRATED_${payment._id}`;
      payment.metadata = {
        migratedAt: new Date(),
        originalPaymentMethod: payment.paymentMethod,
      };

      await payment.save();
    }

    console.log("Payment migration completed");

} catch (error) {
console.error("Migration error:", error);
}
}

// Run migration
migratePayments();

// routes/vendorPayoutRoutes.js
const express = require("express");
const router = express.Router();
const sellerAuth = require("../middleware/sellerAuthMiddleware");
const vendorController = require("../controllers/vendorController");

// Payout routes
router.get("/payouts", sellerAuth, vendorController.getPayouts);
router.post("/paystack/setup", sellerAuth, vendorController.setupPaystackRecipient);
router.post("/bank/validate", sellerAuth, vendorController.validateBankAccount);
router.get("/payout-stats", sellerAuth, vendorController.getPayoutStats);
router.get("/transactions", sellerAuth, vendorController.getPayoutTransactions);

// Test routes (for development only)
if (process.env.NODE_ENV === "development") {
router.post("/test/mock-payout", sellerAuth, vendorController.createMockPayout);
}

module.exports = router;

// backend/routes/paystackRoutes.js
const express = require("express");
const router = express.Router();
const paystackController = require("../controllers/paystackController");
const { validatePaymentRequest } = require("../utils/validators");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Customer payment routes
router.post(
"/initialize",
userAuthMiddleware,
validatePaymentRequest,
paystackController.initializePayment.bind(paystackController)
);

router.get(
"/verify/:reference",
userAuthMiddleware,
paystackController.verifyPayment.bind(paystackController)
);

// Seller routes
router.get(
"/seller/payouts",
sellerAuthMiddleware,
paystackController.getSellerPayouts.bind(paystackController)
);

router.post(
"/seller/bank-account",
sellerAuthMiddleware,
paystackController.addSellerBankAccount.bind(paystackController)
);

// Admin routes
router.get(
"/admin/payouts",
adminAuthMiddleware,
isAdmin,
paystackController.getAllPayouts.bind(paystackController)
);

router.post(
"/admin/process-payouts",
adminAuthMiddleware,
isAdmin,
paystackController.processScheduledPayouts.bind(paystackController)
);

router.get(
"/admin/transactions",
adminAuthMiddleware,
isAdmin,
paystackController.getAllTransactions.bind(paystackController)
);

// Webhook (no auth needed as it's verified by signature)
router.post(
"/webhook",
express.raw({ type: "application/json" }),
require("../middleware/paystackWebhook"),
paystackController.handleWebhook.bind(paystackController)
);

module.exports = router;

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { validatePaymentRequest } = require("../utils/validators");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Payment initialization and verification routes
router.post(
"/initialize",
userAuthMiddleware,
validatePaymentRequest,
paymentController.initializePayment // ISSUE 4: Payment Initialization new
);

// Payment verification route
router.get(
"/verify/:reference",
userAuthMiddleware,
paymentController.verifyPayment // ISSUE 4: Payment Initialization new
);

// Payment history and details
router.get(
"/user/history",
userAuthMiddleware,
paymentController.getUserPaymentHistory
);

// payment details
router.get(
"/user/details/:paymentId",
userAuthMiddleware,
paymentController.getPaymentDetails
);

// Bank account management routes
router.post(
"/verify-account",
userAuthMiddleware,
paymentController.verifyBankAccount
);

// bank details
router.post(
"/bank-details",
userAuthMiddleware,
paymentController.updateBankDetails
);

// bank delete details
router.delete(
"/bank-details",
userAuthMiddleware,
paymentController.deleteBankDetails
);

// Card management routes
router.get("/user/cards", userAuthMiddleware, paymentController.getUserCards);
router.post("/user/cards", userAuthMiddleware, paymentController.addCard);
router.delete(
"/user/cards/:cardId",
userAuthMiddleware,
paymentController.deleteCard
);
router.put(
"/user/cards/:cardId/default",
userAuthMiddleware,
paymentController.setDefaultCard
);

module.exports = router;

// backend/models/vendorPayoutModels.js
const mongoose = require("mongoose");

const vendorPayoutSchema = new mongoose.Schema(
{
// Core payout information
vendorId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
orderId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Order",
required: true,
},
amount: {
type: Number,
required: true,
},
// Status and scheduling
status: {
type: String,
enum: ["pending", "processing", "processed", "failed"],
default: "pending",
},
scheduledDate: {
type: Date,
required: true,
},
processedAt: Date,
// Transaction references
transactionReference: String,
transferReference: String,
// Error handling
errorMessage: String,
retriesCount: {
type: Number,
default: 0,
},
// Payment details
paymentMethod: {
type: String,
enum: ["bank_transfer", "paystack"],
default: "paystack",
},
bankDetails: {
bankName: String,
accountNumber: String,
accountName: String,
bankCode: String,
},
paystack: {
recipientCode: String,
},
// Additional metadata
metadata: {
type: Object,
},
// Batch processing information
batchId: String,
batchProcessedAt: Date,
// Currency
currency: {
type: String,
default: "NGN",
},
},
{
timestamps: true,
}
);

// Indexes
vendorPayoutSchema.index({ vendorId: 1 });
vendorPayoutSchema.index({ status: 1 });
vendorPayoutSchema.index({ scheduledDate: 1 });
vendorPayoutSchema.index({ transactionReference: 1 });
vendorPayoutSchema.index({ transferReference: 1 });

const vendorPayout = mongoose.model("VendorPayout", vendorPayoutSchema);
module.exports = vendorPayout;

// backend/models/paymentModels.js
const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema(
{
accountName: { type: String, trim: true },
accountNumber: { type: String, trim: true },
bankCode: String,
bankName: { type: String, trim: true },
recipientCode: String,
lastVerified: Date,
},
{ \_id: false }
);

const paymentSchema = new mongoose.Schema(
{
orderId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Order",
required: true,
index: true,
},
reference: {
type: String,
sparse: true,
index: true,
},
amount: {
type: Number,
required: true,
min: 0,
get: (v) => parseFloat(v.toFixed(2)),
set: (v) => parseFloat(v.toFixed(2)),
},
email: {
type: String,
required: true,
trim: true,
lowercase: true,
},
status: {
type: String,
enum: ["pending", "success", "failed"],
default: "pending",
index: true,
},
paymentMethod: {
type: String,
enum: ["Paystack", "Bank_transfer", "Cash"],
required: true,
},
metadata: {
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
index: true,
},
userEmail: {
type: String,
required: true,
trim: true,
lowercase: true,
},
custom_fields: [
{
display_name: String,
variable_name: String,
value: String,
},
],
},
currency: {
type: String,
default: "NGN",
uppercase: true,
},
bankDetails: bankDetailsSchema,
paystackData: {
type: Object,
select: false, // Only load when explicitly requested
},
verificationData: {
type: Object,
select: false,
},
},
{
timestamps: true,
toJSON: { getters: true },
toObject: { getters: true },
}
);

// Indexes
paymentSchema.index({ "metadata.userId": 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ reference: 1 });

// Validation middleware
paymentSchema.pre("save", function (next) {
if (this.status !== "pending" && !this.reference) {
throw new Error("Payment reference required for non-pending status");
}
next();
});

// Query helpers
paymentSchema.query.byUser = function (userId) {
return this.where({ "metadata.userId": userId });
};

paymentSchema.query.successful = function () {
return this.where({ status: "success" });
};

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;

// backend/middleware/paystackWebhook.js
const crypto = require("crypto");
require("dotenv").config();

module.exports = (req, res, next) => {
const hash = crypto
.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
.update(JSON.stringify(req.body))
.digest("hex");

if (hash === req.headers["x-paystack-signature"]) {
next();
} else {
return res.status(401).json({
status: false,
message: "Invalid webhook signature",
});
}
};

// backend/controllers/vendorController.js
const VendorPayout = require("../models/vendorPayoutModels");
const Order = require("../models/orderModels");
const PaystackService = require("../services/paystackService");
const payoutConfig = require("../config/devPayoutConfig");

const vendorController = {
// Get vendor's payout history
async getPayouts(req, res) {
try {
// Changed from req.user.\_id to req.user.id
const payouts = await VendorPayout.find({
vendorId: req.user.id,
})
.sort({ createdAt: -1 })
.limit(50);

      // Also update this aggregation
      const pendingAmount = await VendorPayout.aggregate([
        {
          $match: {
            vendorId: req.user.id,
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      // And this query
      const nextPayout = await VendorPayout.findOne({
        vendorId: req.user.id,
        status: "scheduled",
      }).sort({ scheduledDate: 1 });

      res.json({
        payouts,
        stats: {
          pendingAmount: pendingAmount[0]?.total || 0,
          nextPayoutDate: nextPayout?.scheduledDate || null,
          platformFee: payoutConfig.fees.default.platformFee * 100,
        },
      });
    } catch (error) {
      console.error("Error fetching payouts:", error);
      res.status(500).json({ message: "Failed to fetch payout history" });
    }

},

// Setup Paystack recipient
async setupPaystackRecipient(req, res) {
try {
const { bankCode, accountNumber } = req.body;

      if (!bankCode || !accountNumber) {
        return res.status(400).json({
          message: "Bank code and account number are required",
        });
      }

      const response = await PaystackService.createTransferRecipient({
        bankCode,
        accountNumber,
        userId: req.user._id,
      });

      res.json(response);
    } catch (error) {
      console.error("Error setting up recipient:", error);
      res.status(500).json({
        message: error.response?.data?.message || "Failed to setup recipient",
      });
    }

},

// Validate bank account
async validateBankAccount(req, res) {
try {
const { bankCode, accountNumber } = req.body;

      if (!bankCode || !accountNumber) {
        return res.status(400).json({
          message: "Bank code and account number are required",
        });
      }

      const response = await PaystackService.validateBankAccount({
        bankCode,
        accountNumber,
      });

      res.json(response);
    } catch (error) {
      console.error("Error validating bank account:", error);
      res.status(500).json({
        message:
          error.response?.data?.message || "Failed to validate bank account",
      });
    }

},

// Get payout stats
async getPayoutStats(req, res) {
try {
const [totalPending, totalProcessed] = await Promise.all([
VendorPayout.aggregate([
{
$match: {
vendorId: req.user._id,
status: "pending",
},
},
{
$group: {
_id: null,
total: { $sum: "$amount" },
},
},
]),
VendorPayout.aggregate([
{
$match: {
vendorId: req.user._id,
status: "processed",
},
},
{
$group: {
_id: null,
total: { $sum: "$amount" },
},
},
]),
]);

      const nextPayout = await VendorPayout.findOne({
        vendorId: req.user._id,
        status: "scheduled",
      }).sort({ scheduledDate: 1 });

      res.json({
        pendingAmount: totalPending[0]?.total || 0,
        processedAmount: totalProcessed[0]?.total || 0,
        nextPayoutDate: nextPayout?.scheduledDate || null,
        platformFee: payoutConfig.fees.default.platformFee * 100,
      });
    } catch (error) {
      console.error("Error fetching payout stats:", error);
      res.status(500).json({ message: "Failed to fetch payout stats" });
    }

},

// Get payout transactions
async getPayoutTransactions(req, res) {
try {
const transactions = await VendorPayout.aggregate([
{
$match: { vendorId: req.user._id },
},
{
$lookup: {
from: "orders",
localField: "orderId",
foreignField: "_id",
as: "order",
},
},
{
$unwind: "$order",
},
{
$sort: { createdAt: -1 },
},
{
$limit: 50,
},
]);

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }

},

// Create mock payout (for testing)
async createMockPayout(req, res) {
if (process.env.NODE_ENV !== "development") {
return res.status(403).json({ message: "Not allowed in production" });
}

    try {
      const mockPayout = new VendorPayout({
        vendorId: req.user._id,
        amount: req.body.amount || 1000,
        status: "pending",
        scheduledDate: new Date(),
        paymentMethod: "paystack",
        currency: "NGN",
      });

      await mockPayout.save();
      res.json(mockPayout);
    } catch (error) {
      console.error("Error creating mock payout:", error);
      res.status(500).json({ message: "Failed to create mock payout" });
    }

},
};

module.exports = vendorController;

// backend/controllers/paystackController.js
const Payment = require("../models/paymentModels");
const VendorPayout = require("../models/vendorPayoutModels");
const PaystackService = require("../services/paystackService");
const { calculateFees } = require("../utils/paymentUtils");
const logger = require("../utils/logger");

class PaystackController {
constructor() {
this.paystackService = new PaystackService();
}

async initializePayment(req, res) {
let payment = null;

    try {
      const { email, amount, vendorAmount, platformFee, metadata } = req.body;

      logger.info("Payment initialization request:", {
        email,
        amount,
        orderId: metadata?.orderId,
      });

      // Validate required fields
      if (!email || !amount || !vendorAmount || !platformFee || !metadata) {
        return res.status(400).json({
          status: false,
          message: "Missing required fields",
        });
      }

      // Convert all amounts to numbers and validate
      const totalAmount = Math.round(parseFloat(amount) * 100); // Convert NGN to kobo
      const vendorShare = Math.round(parseFloat(vendorAmount) * 100);
      const platformShare = Math.round(parseFloat(platformFee) * 100);

      // Validate amounts are positive numbers
      if (
        isNaN(totalAmount) ||
        isNaN(vendorShare) ||
        isNaN(platformShare) ||
        totalAmount <= 0 ||
        vendorShare <= 0 ||
        platformShare <= 0
      ) {
        return res.status(400).json({
          status: false,
          message: "Invalid amount values",
        });
      }

      // Verify amount calculations with small decimal tolerance
      const calculationDifference = Math.abs(
        vendorShare + platformShare - totalAmount
      );
      if (calculationDifference > 0.01) {
        logger.error("Amount mismatch:", {
          totalAmount,
          vendorShare,
          platformShare,
        });
        return res.status(400).json({
          status: false,
          message: "Amount mismatch in calculation",
        });
      }

      // Convert amounts to kobo for Paystack
      const amountInKobo = Math.round(totalAmount * 100);

      // Ensure shipping metadata includes user ID
      const shippingData = {
        ...metadata.shipping,
        user: req.user._id, // Add user ID to shipping data
      };

      // Create payment record
      payment = new Payment({
        orderId: metadata.orderId,
        reference: `PAY-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        amount: totalAmount,
        email,
        vendorAmount: vendorShare,
        platformFee: platformShare,
        status: "pending",
        metadata: {
          userId: req.user._id,
          userEmail: email,
          customerName: metadata.customerName,
          //   items: metadata.items,
          items: metadata.items.map((item) => ({
            ...item,
            amountInKobo: Math.round(item.price), // Remove *100
            vendorAmountInKobo: Math.round(item.vendorAmount),
            platformFeeInKobo: Math.round(item.platformFee),
          })),
          shipping: shippingData,
          shippingFee: metadata.shippingFee,
          totalBeforeShipping: metadata.totalBeforeShipping,
          totalAfterShipping: metadata.totalAfterShipping,
          custom_fields: metadata.custom_fields || [],
        },
      });

      // Validate payment record before saving
      await payment.validate();
      await payment.save();
      logger.info("Payment record created:", { paymentId: payment._id });

      // Initialize Paystack transaction
      const paystackData = {
        email,
        amount: amountInKobo,
        reference: payment.reference,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: {
          orderId: payment.orderId.toString(),
          paymentId: payment._id.toString(),
          userId: req.user._id.toString(),
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: payment.orderId.toString(),
            },
            {
              display_name: "Payment ID",
              variable_name: "payment_id",
              value: payment._id.toString(),
            },
          ],
        },
      };

      // Add split payment if vendor subaccount exists
      if (metadata.vendorSubaccountCode) {
        paystackData.split = {
          type: "percentage",
          bearer_type: "account",
          subaccounts: [
            {
              subaccount: metadata.vendorSubaccountCode,
              share: 92,
            },
          ],
        };
      }

      // Initialize transaction with Paystack
      const response = await this.paystackService.initializeTransaction(
        paystackData
      );

      // Validate Paystack response
      if (!response?.status || !response?.data?.authorization_url) {
        throw new Error("Invalid response from Paystack");
      }

      logger.info("Transaction initialized:", {
        reference: response.data.reference,
        authorization_url: response.data.authorization_url,
      });

      // Send success response
      return res.status(200).json({
        status: true,
        data: response.data,
      });
    } catch (error) {
      logger.error("Payment initialization error:", {
        error: error.message,
        stack: error.stack,
        metadata: req.body.metadata,
      });

      // Attempt to rollback payment record if it exists
      if (payment?._id) {
        try {
          await Payment.findByIdAndUpdate(payment._id, {
            status: "failed",
            errorMessage: error.message,
          });
          logger.info("Payment record rolled back:", {
            paymentId: payment._id,
          });
        } catch (rollbackError) {
          logger.error("Error rolling back payment:", rollbackError);
        }
      }

      return res.status(500).json({
        status: false,
        message: error.message || "Could not initialize payment",
        code: error.code || "PAYMENT_INIT_ERROR",
      });
    }

}

// Add verification endpoint
async verifyPayment(req, res) {
try {
const { reference } = req.params;

      if (!reference) {
        return res.status(400).json({
          status: false,
          message: "Payment reference is required",
        });
      }

      // Find existing payment record
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        return res.status(404).json({
          status: false,
          message: "Payment record not found",
        });
      }

      // Verify with Paystack
      const verificationResult = await this.paystackService.verifyTransaction(
        reference
      );

      if (!verificationResult.status) {
        payment.status = "failed";
        await payment.save();
        return res.status(400).json({
          status: false,
          message: "Payment verification failed",
        });
      }

      // Update payment status
      payment.status = "success";
      payment.verificationData = verificationResult.data;
      await payment.save();

      // Create vendor payouts
      const vendorPayouts = [];
      for (const item of payment.metadata.items) {
        const payout = new VendorPayout({
          vendorId: item.vendorId,
          paymentId: payment._id,
          amount: item.vendorAmount,
          status: "pending",
        });
        vendorPayouts.push(await payout.save());
      }

      return res.status(200).json({
        status: true,
        data: {
          payment,
          vendorPayouts,
        },
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not verify payment",
      });
    }

}

// Seller methods
async getSellerPayouts(req, res) {
try {
const sellerId = req.user.\_id;
const payouts = await VendorPayout.find({ vendorId: sellerId }).sort({
createdAt: -1,
});

      return res.status(200).json({
        status: true,
        data: payouts,
      });
    } catch (error) {
      console.error("Error fetching seller payouts:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch payouts",
      });
    }

}

async addSellerBankAccount(req, res) {
try {
const { accountNumber, bankCode } = req.body;
const sellerId = req.user.\_id;

      const response = await this.paystackService.createTransferRecipient({
        accountNumber,
        bankCode,
        sellerId,
        name: `${req.user.firstName} ${req.user.lastName}`,
      });

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error adding bank account:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not add bank account",
      });
    }

}

// Admin methods
async getAllPayouts(req, res) {
try {
const payouts = await VendorPayout.find()
.populate("vendorId", "firstName lastName email")
.sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        data: payouts,
      });
    } catch (error) {
      console.error("Error fetching all payouts:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch payouts",
      });
    }

}

// Add payout processing endpoint
async processScheduledPayouts(req, res) {
try {
// Ensure the user is admin (additional security check)
if (req.user.role !== "admin") {
return res.status(403).json({
status: false,
message: "Unauthorized access",
});
}

      const results = await this.paystackService.processPayouts();

      return res.status(200).json({
        status: true,
        data: results,
        message: `Successfully processed ${results.length} payouts`,
      });
    } catch (error) {
      console.error("Error processing scheduled payouts:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not process scheduled payouts",
      });
    }

}

async getAllTransactions(req, res) {
try {
const transactions = await Payment.find()
.populate("orderId")
.sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        data: transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({
        status: false,
        message: "Could not fetch transactions",
      });
    }

}

// Webhook handler
async handleWebhook(req, res) {
try {
const event = req.body;
console.log("Received webhook event:", event.event);

      switch (event.event) {
        case "charge.success":
          await this.paystackService.verifyTransaction(event.data.reference);
          break;
        case "transfer.success":
          await this.paystackService.handleSuccessfulTransfer(event.data);
          break;
        case "transfer.failed":
          await this.paystackService.handleFailedTransfer(event.data);
          break;
        default:
          console.log(`Unhandled webhook event: ${event.event}`);
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error("Webhook processing error:", error);
      // Log the full error details
      console.error({
        message: error.message,
        stack: error.stack,
        eventType: req.body?.event,
        reference: req.body?.data?.reference,
      });

      return res.sendStatus(500);
    }

}
}

module.exports = new PaystackController();

const mongoose = require("mongoose");
const Payment = require("../models/paymentModels");
const PaystackService = require("../services/paystackService");
const DemoPaystackService = require("../services/demoPaystackService");
const Card = require("../models/cardModel");
const User = require("../models/userModels");
const logger = require("../utils/logger");

// const paystackService = new PaystackService(); // Create instance outside the class

const paystackService =
process.env.NODE_ENV === "development"
? new DemoPaystackService()
: new PaystackService();

class PaymentController {
// Initialize payment with Paystack
async initializePayment(req, res) {
try {
const { orderId, email } = req.body;

      const paystackResponse = await paystackService.initializeTransaction({
        email,
        metadata: {
          orderId,
          userId: req.user._id,
          userEmail: email,
          customerName: `${req.user.firstName} ${req.user.lastName}`,
        },
      });

      return res.status(200).json({
        status: true,
        data: {
          authorization_url: paystackResponse.data.authorization_url,
          reference: paystackResponse.data.reference,
        },
      });
    } catch (error) {
      logger.error("Payment initialization error:", error);
      return res.status(500).json({
        message: error.message || "Could not initialize payment",
      });
    }

}

// Verify payment with Paystack
async verifyPayment(req, res) {
try {
const verification = await paystackService.verifyTransaction(
req.params.reference
);
return res.status(200).json({
status: true,
data: verification.data,
});
} catch (error) {
logger.error("Payment verification error:", error);
return res.status(500).json({
message: error.message || "Could not verify payment",
});
}
}

// Get user payment history
async getUserPaymentHistory(req, res) {
try {
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) \* limit;

      const payments = await Payment.find({ "metadata.userId": req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "orderId",
          select: "orderId totalAmount status",
        });

      const total = await Payment.countDocuments({
        "metadata.userId": req.user._id,
      });

      return res.status(200).json({
        status: true,
        data: payments.map((payment) => ({
          id: payment._id,
          reference: payment.reference,
          amount: payment.amount,
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          orderId: payment.orderId?.orderId,
          createdAt: payment.createdAt,
          email: payment.email,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error("Error fetching payment history:", error);
      return res.status(500).json({
        message: "Could not fetch payment history",
      });
    }

}

// Get payment details
async getPaymentDetails(req, res) {
try {
const payment = await Payment.findOne({
\_id: req.params.paymentId,
"metadata.userId": req.user.\_id,
}).populate("orderId");

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      return res.status(200).json({
        status: true,
        data: payment,
      });
    } catch (error) {
      logger.error("Error fetching payment details:", error);
      return res.status(500).json({
        message: "Could not fetch payment details",
      });
    }

}

// ================== Bank Account Management ==================
// Verify bank account
async verifyBankAccount(req, res) {
try {
const { accountNumber, bankCode, isDemoMode } = req.body;

      if (!accountNumber || !bankCode) {
        return res.status(400).json({
          status: false,
          message: "Account number and bank code are required",
        });
      }

      let response;

      // Use demo service in development mode
      if (isDemoMode || process.env.NODE_ENV === "development") {
        // Use demo service
        response = await paystackService.verifyBankAccount({
          accountNumber,
          bankCode,
        });
      } else {
        // Use live service
        response = await paystackService.verifyBankAccount({
          account_number: accountNumber,
          bank_code: bankCode,
        });
      }

      return res.status(200).json({
        status: true,
        data: response.data,
        // data: {
        //   account_name: response.data.account_name,
        //   account_number: response.data.account_number,
        //   bank_code: bankCode,
        // },
      });
    } catch (error) {
      logger.error("Error verifying bank account:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "Could not verify bank account",
      });
    }

}

// Update bank details
async updateBankDetails(req, res) {
try {
const { accountName, accountNumber, bankCode, bankName, payoutSchedule } =
req.body;

      // Validate required fields
      if (!accountName || !accountNumber || !bankCode || !bankName) {
        return res.status(400).json({
          status: false,
          message: "All bank details are required",
        });
      }

      // Update user's bank details
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Update bank details
      user.paystack = {
        accountName,
        accountNumber,
        bankCode,
        bankName,
        payoutSchedule: payoutSchedule || "weekly",
        lastVerified: new Date(),
      };

      await user.save();

      return res.status(200).json({
        status: true,
        message: "Bank details updated successfully",
        data: user.paystack,
      });
    } catch (error) {
      logger.error("Error updating bank details:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not update bank details",
      });
    }

}

// Delete bank details
async deleteBankDetails(req, res) {
try {
const user = await User.findById(req.user.\_id);
if (!user) {
return res.status(404).json({
status: false,
message: "User not found",
});
}

      // Remove bank details
      user.paystack = undefined;
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Bank details deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting bank details:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Could not delete bank details",
      });
    }

}

// ================== Card Management ==================

// Get user cards
async getUserCards(req, res) {
try {
const cards = await Card.find({ userId: req.user.\_id })
.select("-token")
.sort({ isDefault: -1, createdAt: -1 });

      return res.status(200).json({
        status: true,
        data: cards.map((card) => ({
          id: card._id,
          last4: card.last4,
          cardType: card.cardType,
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          holderName: card.holderName,
          isDefault: card.isDefault,
        })),
      });
    } catch (error) {
      logger.error("Error fetching user cards:", error);
      return res.status(500).json({
        message: "Could not fetch cards",
      });
    }

}

// Add a new card
async addCard(req, res) {
try {
const { number, holderName, expiryMonth, expiryYear, cvv, setAsDefault } =
req.body;

      // First check if user already has 5 cards
      const existingCardsCount = await Card.countDocuments({
        userId: req.user._id,
      });

      if (existingCardsCount >= 5) {
        return res.status(400).json({
          status: false,
          message:
            "Maximum limit of 5 cards reached. Please delete an existing card to add a new one.",
        });
      }

      // Basic validation
      if (!number || !holderName || !expiryMonth || !expiryYear || !cvv) {
        return res.status(400).json({
          status: false,
          message: "All card fields are required",
        });
      }

      // Remove spaces from card number
      const cleanNumber = number.replace(/\s/g, "");
      const last4 = cleanNumber.slice(-4);

      try {
        // Tokenize card with Paystack
        const tokenizationResult = await paystackService.tokenizeCard({
          number: cleanNumber,
          cvv,
          expiryMonth,
          expiryYear,
          email: req.user.email,
        });

        // If this is the first card or setAsDefault is true, set isDefault
        const existingCards = await Card.countDocuments({
          userId: req.user._id,
        });
        const isDefault = setAsDefault || existingCards === 0;

        // Create card record
        const card = new Card({
          userId: req.user._id,
          token: tokenizationResult.token,
          last4,
          cardType: tokenizationResult.card_type,
          expiryMonth,
          expiryYear,
          holderName,
          isDefault: setAsDefault || existingCardsCount === 0,
        });

        // If this is set as default, update other cards
        if (isDefault) {
          await Card.updateMany(
            { userId: req.user._id, _id: { $ne: card._id } },
            { $set: { isDefault: false } }
          );
        }

        await card.save();

        return res.status(201).json({
          status: true,
          message: "Card added successfully",
          data: {
            id: card._id,
            last4: card.last4,
            cardType: card.cardType,
            expiryMonth: card.expiryMonth,
            expiryYear: card.expiryYear,
            holderName: card.holderName,
            isDefault: card.isDefault,
          },
        });
      } catch (error) {
        if (error.message === "Maximum number of cards (5) reached") {
          return res.status(400).json({
            status: false,
            message:
              "Maximum limit of 5 cards reached. Please delete an existing card to add a new one.",
          });
        }

        return res.status(400).json({
          status: false,
          message: "Invalid card details",
        });
      }
    } catch (error) {
      logger.error("Error adding card:", error);
      return res.status(500).json({
        status: false,
        message:
          error.message === "Maximum number of cards (5) reached"
            ? "Maximum limit of 5 cards reached. Please delete an existing card to add a new one."
            : "Could not add card",
      });
    }

}

// Delete a card
async deleteCard(req, res) {
try {
const { cardId } = req.params;

      // Validate cardId
      if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).json({
          status: false,
          message: "Invalid card ID",
        });
      }

      // Find card and verify ownership
      const card = await Card.findOne({
        _id: cardId,
        userId: req.user._id,
      });

      if (!card) {
        return res.status(404).json({
          status: false,
          message: "Card not found",
        });
      }

      // If this is the default card and there are other cards,
      // set another card as default
      if (card.isDefault) {
        const otherCard = await Card.findOne({
          userId: req.user._id,
          _id: { $ne: cardId },
        }).sort({ createdAt: -1 });

        if (otherCard) {
          otherCard.isDefault = true;
          await otherCard.save();
        }
      }

      // Use deleteOne instead of remove (which is deprecated)
      await Card.deleteOne({ _id: cardId });

      return res.status(200).json({
        status: true,
        message: "Card deleted successfully",
      });
    } catch (error) {
      logger.error("Error deleting card:", error);
      return res.status(500).json({
        status: false,
        message: "Could not delete card",
        error: error.message,
      });
    }

}

// Set a card as default
async setDefaultCard(req, res) {
try {
const { cardId } = req.params;

      // Find card and verify ownership
      const card = await Card.findOne({
        _id: cardId,
        userId: req.user._id,
      });

      if (!card) {
        return res.status(404).json({
          status: false,
          message: "Card not found",
        });
      }

      // Update all cards to non-default
      await Card.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );

      // Set selected card as default
      card.isDefault = true;
      await card.save();

      logger.info("Default card updated:", {
        userId: req.user._id,
        cardId,
      });

      return res.status(200).json({
        status: true,
        message: "Default card updated successfully",
      });
    } catch (error) {
      logger.error("Error setting default card:", error);
      return res.status(500).json({
        status: false,
        message: "Could not update default card",
      });
    }

}
}

module.exports = new PaymentController();

// config/payoutConfig.js
module.exports = {
schedules: {
default: {
holdingPeriod: 3,
minimumAmount: 1000,
batchSize: 100,
},
premium: {
holdingPeriod: 1,
minimumAmount: 500,
batchSize: 200,
},
},
retryStrategy: {
maxAttempts: 3,
delays: [24, 48, 72],
},
fees: {
default: {
platformFee: 0.08,
vendorShare: 0.92,
},
premium: {
platformFee: 0.05,
vendorShare: 0.95,
},
},
notifications: {
sendVendorNotifications: true,
notifyOnFailure: true,
notifyBeforePayout: true,
reminderHours: 24,
},
};

// For testing vendor's payment system logics in minutes instead of days

// config/devPayoutConfig.js
module.exports = {
schedules: {
default: {
holdingPeriod: 5, // 5 minutes instead of 3 days
minimumAmount: 100, // Lower minimum amount for testing
batchSize: 100,
},
premium: {
holdingPeriod: 2, // 2 minutes instead of 1 day
minimumAmount: 50,
batchSize: 200,
},
},
retryStrategy: {
maxAttempts: 3,
delays: [1, 2, 3], // Minutes instead of days
},
fees: {
default: {
platformFee: 0.08,
vendorShare: 0.92,
},
premium: {
platformFee: 0.05,
vendorShare: 0.95,
},
},
notifications: {
sendVendorNotifications: true,
notifyOnFailure: true,
notifyBeforePayout: true,
reminderHours: 0.1, // 6 minutes instead of 24 hours
},
triggers: {
autoPayoutEnabled: true,
conditions: {
orderStatus: ["Delivered"],
minWaitTime: 2, // 2 minutes after delivery
maxWaitTime: 10, // 10 minutes maximum
},
},
};

// backend/config/cronJobs.js
require("dotenv").config();
const cron = require("node-cron");
const logger = require("../utils/logger");
const payoutService = require("../services/payoutService");

const initPayoutCron = () => {
const cronSchedule = process.env.PAYOUT_CRON_SCHEDULE || "0 0 \* \* \*";

if (!cron.validate(cronSchedule)) {
logger.error(`Invalid cron schedule: ${cronSchedule}`);
return;
}

cron.schedule(cronSchedule, async () => {
logger.info(`Starting scheduled payout processing at ${new Date()}`);
await payoutService.processVendorPayouts();
});

logger.info("Payout cron job initialized successfully");
};

module.exports = {
initPayoutCron,
processPayouts: () => payoutService.processVendorPayouts(),
};
