backend/

├── config/

│ └── cronJobs.js (new)

├── controllers/

│ └── paystackController.js (new)

├── middleware/

│ ├── adminAuthMiddleware.js (existing)

│ ├── isAdmin.js (existing)

│ ├── sellerAuthMiddleware.js (existing)

│ ├── userAuthMiddleware.js (existing)

│ ├── loggerMiddleware.js (new)

│ └── paystackWebhook.js (new)

├── models/

│ ├── userModels.js (existing)

│ ├── PaymentModels.js (new)

│ └── VendorPayoutModels.js (new)

├── routes/

│ └── paystackRoutes.js (new)

├── services/

│ ├── paystackService.js (new)

│ └── payoutService.js (new)

├── utils/

│ ├── logger.js (new)

│ └── paymentUtils.js (new)

│ └── validators.js (new)

└── tests/

    └── logger.test.js (new)

const mongoose = require("mongoose");

const PaymentOldSchema = new mongoose.Schema(
{
// Core payment information
user: {
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
// Vendor payment details
vendorAmount: {
type: Number,
required: true,
},
platformFee: {
type: Number,
required: true,
},
// Payment method and status
paymentMethod: {
type: String,
enum: ["Paystack", "Credit Card", "PayPal", "Bank Transfer"],
required: true,
},
status: {
type: String,
enum: ["pending", "processing", "success", "failed"],
default: "pending",
},
// Transaction references
reference: {
type: String,
required: true,
unique: true,
},
transactionId: {
type: String,
},
// Refund information
refundAmount: {
type: Number,
},
refundStatus: {
type: String,
enum: ["Requested", "Processing", "Completed", "Failed"],
},
// Dispute handling
disputeStatus: {
type: String,
enum: ["Pending", "Resolved", "Declined"],
},
disputeReason: {
type: String,
},
// Additional data
metadata: {
type: Object,
},
paymentGatewayData: {
type: mongoose.Schema.Types.Mixed,
},
},
{
timestamps: true,
}
);

// Indexes
PaymentOldSchema.index({ reference: 1 }, { unique: true });
PaymentOldSchema.index({ user: 1 });
PaymentOldSchema.index({ orderId: 1 });
PaymentOldSchema.index({ status: 1 });
PaymentOldSchema.index({ createdAt: 1 });

const PaymentOld = mongoose.model("Payment", PaymentOldSchema);

module.exports = PaymentOld;

const Payment = require("../models/paymentModelsOld");

// Process a new payment
const processPayment = async (req, res) => {
// Implementation based on your application's payment processing logic
// Example: create a new payment record in the database
try {
// Extract necessary data from request body
const { user, order, amount, paymentMethod, transactionId } = req.body;

    // Create a new payment record
    const newPayment = new Payment({
      user,
      order,
      amount,
      paymentMethod,
      transactionId,
    });

    // Save the payment record
    const savedPayment = await newPayment.save();

    res.status(201).json(savedPayment);

} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Get payment by ID (modified to check if the requester is the seller)
const getPaymentById = async (req, res) => {
try {
const payment = await Payment.findById(req.params.paymentId);
if (!payment) {
return res.status(404).json({ message: "Payment not found" });
}

    // Check if the requester is the seller or the user associated with the payment
    if (
      req.user._id.toString() !== payment.user.toString() &&
      req.user._id.toString() !== payment.seller.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this payment" });
    }

    res.json(payment);

} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Get payments by user ID
const getPaymentsByUser = async (req, res) => {
try {
const payments = await Payment.find({ user: req.params.userId });
res.json(payments);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Get all payments (admin only)
const getAllPayments = async (req, res) => {
try {
const payments = await Payment.find();
res.json(payments);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

// New function: Get payments by seller ID
const getPaymentsBySeller = async (req, res) => {
try {
const sellerId = req.params.sellerId;
const payments = await Payment.find({ seller: sellerId });
res.json(payments);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Update payment status (modified to allow seller access)
const updatePaymentStatus = async (req, res) => {
try {
const { paymentId } = req.params;
const { paymentStatus } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check if the requester is the seller or an admin
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== payment.seller.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this payment" });
    }

    payment.paymentStatus = paymentStatus;
    await payment.save();

    res.status(200).json(payment);

} catch (error) {
console.error("Error updating payment status:", error);
res.status(500).json({ message: "Server error" });
}
};

// Request a refund for a payment
const requestRefund = async (req, res) => {
try {
const { refundAmount } = req.body;
const payment = await Payment.findById(req.params.paymentId);
if (!payment) {
return res.status(404).json({ message: "Payment not found" });
}
payment.refundAmount = refundAmount;
payment.refundStatus = "Requested";
const savedPayment = await payment.save();
res.json(savedPayment);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Process a refund (admin only)
const processRefund = async (req, res) => {
try {
const { refundStatus } = req.body;
const updatedPayment = await Payment.findByIdAndUpdate(
req.params.paymentId,
{ refundStatus },
{ new: true }
);
res.json(updatedPayment);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Initiate a dispute for a payment
const initiateDispute = async (req, res) => {
try {
const { disputeReason } = req.body;
const payment = await Payment.findById(req.params.paymentId);
if (!payment) {
return res.status(404).json({ message: "Payment not found" });
}
payment.disputeReason = disputeReason;
payment.disputeStatus = "Pending";
const savedPayment = await payment.save();
res.json(savedPayment);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Resolve a dispute (admin only)
const resolveDispute = async (req, res) => {
try {
const updatedPayment = await Payment.findByIdAndUpdate(
req.params.paymentId,
{ disputeStatus: "Resolved" },
{ new: true }
);
res.json(updatedPayment);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

// Decline a dispute (admin only)
const declineDispute = async (req, res) => {
try {
const updatedPayment = await Payment.findByIdAndUpdate(
req.params.paymentId,
{ disputeStatus: "Declined" },
{ new: true }
);
res.json(updatedPayment);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

module.exports = {
processPayment,
getPaymentById,
getPaymentsByUser,
getAllPayments,
getPaymentsBySeller,
updatePaymentStatus,
requestRefund,
processRefund,
initiateDispute,
resolveDispute,
declineDispute,
};

const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
processPayment,
getPaymentById,
getPaymentsByUser,
getPaymentsBySeller,
getAllPayments,
updatePaymentStatus,
requestRefund,
processRefund,
initiateDispute,
resolveDispute,
declineDispute,
} = require("../controllers/paymentControllerOld");

const router = express.Router();

// Process a new payment (authenticated user)
router.post("/", userAuthMiddleware, processPayment);

// Get payment by ID (authenticated user or seller)
router.get("/:paymentId", [userAuthMiddleware, sellerAuthMiddleware], getPaymentById);

// Get payments by user ID (authenticated user)
router.get("/user/:userId", userAuthMiddleware, getPaymentsByUser);

// Get payments by seller ID (authenticated seller)
router.get("/seller/:sellerId", sellerAuthMiddleware, getPaymentsBySeller);

// Get all payments (admin only)
router.get("/", adminAuthMiddleware, getAllPayments);

// Update payment status (admin or seller)
router.patch("/:paymentId/status", [adminAuthMiddleware, sellerAuthMiddleware], updatePaymentStatus);

// Request a refund for a payment (authenticated user)
router.post("/:paymentId/refund", userAuthMiddleware, requestRefund);

// Process a refund (admin or seller)
router.patch("/:paymentId/refund", [adminAuthMiddleware, sellerAuthMiddleware], processRefund);

// Initiate a dispute for a payment (authenticated user)
router.post("/:paymentId/dispute", userAuthMiddleware, initiateDispute);

// Resolve a dispute (admin or seller)
router.patch("/:paymentId/dispute/resolve", [adminAuthMiddleware, sellerAuthMiddleware], resolveDispute);

// Decline a dispute (admin or seller)
router.patch("/:paymentId/dispute/decline", [adminAuthMiddleware, sellerAuthMiddleware], declineDispute);

module.exports = router;

Here's how the system works:

1. File Structure and Relationships:

backend/
├── config/
│ ├── payoutConfig.js # Payout settings and fee structures
│ └── cronJobs.js # Automated payout scheduling
├── controllers/
│ └── paystackController.js # Payment and payout endpoint handlers
├── models/
│ ├── paymentModels.js # Payment transaction schema
│ ├── vendorPayoutModels.js # Vendor payout records
│ └── userModels.js # User/vendor information
├── services/
│ ├── paystackService.js # Paystack API integration
│ └── payoutService.js # Payout business logic
└── routes/
└── paystackRoutes.js # API route definitions

frontend/
├── src/
│ ├── views/
│ │ ├── CheckoutPage.vue # Payment initiation
│ │ └── PaymentCallback.vue # Payment verification
│ └── store/
│ └── paymentStore.js # Payment state management

2. Key Workflows:

a) Payment Collection:

- Customer initiates payment through CheckoutPage.vue
- Payment goes to platform's Paystack account
- paystackController.js handles the payment verification
- Successful payments are recorded in paymentModels.js

b) Vendor Payouts:

- payoutConfig.js defines payout schedules and fees
- cronJobs.js runs automated payout processing
- payoutService.js handles the payout logic:

  - Groups payments by vendor
  - Calculates vendor shares
  - Creates payout records
  - Initiates transfers to vendor accounts

c) Vendor Onboarding:

- Vendors add bank details through addSellerBankAccount endpoint
- paystackService.js creates transfer recipients
- Bank details stored in userModels.js

3. Configuration Highlights:

// payoutConfig.js key settings
{
schedules: {
default: {
holdingPeriod: 3, // Days to hold payments
minimumAmount: 1000, // Minimum payout amount
}
},
fees: {
default: {
platformFee: 0.08, // 8% platform fee
vendorShare: 0.92, // 92% vendor share
}
}
}

4. Security Features:

- Webhook signature verification
- Sensitive data filtering in logs
- Payment amount validation
- Proper error handling and retries

stateDiagram-v2
direction TB

    state "Frontend Components" as Frontend {
        [*] --> CheckoutPage
        CheckoutPage --> PaymentCallback
    }

    state "Backend Controllers" as Controllers {
        state "PaystackController" as PC {
            [*] --> initializePayment
            initializePayment --> verifyPayment
            verifyPayment --> processScheduledPayouts
            state "Vendor Operations" as VO {
                getSellerPayouts
                addSellerBankAccount
            }
        }
    }

    state "Services" as Services {
        state "PaystackService" as PS {
            initializeTransaction
            verifyTransaction
            createTransferRecipient
            processPayouts
        }
        state "PayoutService" as POS {
            processVendorPayouts
            scheduleVendorPayout
            groupPayoutsByVendor
        }
    }

    state "Models" as Models {
        Payment
        VendorPayout
        User
    }

    state "Configuration" as Config {
        payoutConfig --> schedules
        payoutConfig --> retryStrategy
        payoutConfig --> fees
        cronJobs
    }

    Frontend --> Controllers : HTTP Requests
    Controllers --> Services : Business Logic
    Services --> Models : Data Operations
    Config --> Services : Configuration

https://paydunya.com/activate-account

https://console.twilio.com/?selectedTab=dynamic#
