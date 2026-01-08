const mongoose = require("mongoose");

exports.validatePaymentRequest = (req, res, next) => {
  const { email, amount, metadata } = req.body;

  // Log the request for debugging
  console.log("Validating payment request:", { email, amount, metadata });

  // Basic field validation
  if (!email || !amount) {
    return res.status(400).json({
      status: false,
      message: "Missing required fields: email and amount",
    });
  }

  // Metadata validation with type checking
  if (!metadata || typeof metadata !== "object") {
    return res.status(400).json({
      status: false,
      message: "Invalid metadata format",
    });
  }

  // Ensure orderId exists and is in the correct format
  if (!metadata.orderId || typeof metadata.orderId !== "string") {
    return res.status(400).json({
      status: false,
      message: "Invalid or missing orderId in metadata",
    });
  }

  // Validate items array
  if (!Array.isArray(metadata.items) || metadata.items.length === 0) {
    return res.status(400).json({
      status: false,
      message: "Missing or invalid items array in metadata",
    });
  }

  // Validate each item in the items array
  for (const item of metadata.items) {
    if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid productId in items array",
      });
    }
    if (
      !item.quantity ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid quantity in items array",
      });
    }
  }

  // If everything is valid, proceed
  next();
};
