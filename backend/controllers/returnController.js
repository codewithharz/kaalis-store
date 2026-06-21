// backend/controllers/returnController.js
const Return = require("../models/returnModels");
const Order = require("../models/orderModels");

const createReturnRequest = async (req, res) => {
  try {
    const { orderId, reason, comments } = req.body;
    const userId = req.user._id;

    if (!orderId || !reason) {
      return res.status(400).json({ message: "Order ID and reason are required" });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to user
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to return this order" });
    }

    // Verify order status is 'Delivered'
    if (order.status !== "Delivered") {
      return res.status(400).json({ message: "Only delivered orders can be returned" });
    }

    // Verify order is within last 30 days
    const deliveryDate = new Date(order.updatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (deliveryDate < thirtyDaysAgo) {
      return res.status(400).json({ message: "Returns are only allowed within 30 days of delivery" });
    }

    // Verify no duplicate return request
    const existingReturn = await Return.findOne({ order: orderId });
    if (existingReturn) {
      return res.status(400).json({ message: "A return request already exists for this order" });
    }

    // Create return
    const newReturn = new Return({
      user: userId,
      order: orderId,
      reason,
      comments: comments || "",
      status: "Pending",
      statusHistory: [
        {
          status: "Pending",
          comment: "Return request submitted by buyer",
          timestamp: new Date()
        }
      ]
    });

    await newReturn.save();
    return res.status(201).json({
      success: true,
      message: "Return request submitted successfully",
      returnRequest: newReturn
    });
  } catch (error) {
    console.error("Error creating return request:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getUserReturns = async (req, res) => {
  try {
    const userId = req.user._id;
    const returns = await Return.find({ user: userId })
      .populate({
        path: "order",
        populate: {
          path: "products.product",
          model: "Product"
        }
      })
      .sort({ createdAt: -1 });

    // Format the returns to match the frontend expected structure
    const formattedReturns = returns.map(ret => {
      return {
        _id: ret._id,
        returnId: ret.returnId,
        orderId: ret.order ? ret.order.orderId : "Unknown",
        reason: ret.reason,
        comments: ret.comments,
        status: ret.status,
        statusHistory: ret.statusHistory,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
        products: ret.order ? ret.order.products : []
      };
    });

    return res.status(200).json({
      success: true,
      returns: formattedReturns
    });
  } catch (error) {
    console.error("Error getting user returns:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getAdminReturns = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get returns, populate orders and users
    let returns = await Return.find(query)
      .populate("user", "username email")
      .populate({
        path: "order",
        populate: {
          path: "products.product",
          model: "Product"
        }
      })
      .sort({ createdAt: -1 });

    // Filter by search query if present (Return ID, Order ID, or Username)
    if (search) {
      const searchLower = search.toLowerCase();
      returns = returns.filter(ret => {
        const matchesReturnId = ret.returnId?.toLowerCase().includes(searchLower);
        const matchesOrderId = ret.order?.orderId?.toLowerCase().includes(searchLower);
        const matchesUsername = ret.user?.username?.toLowerCase().includes(searchLower);
        return matchesReturnId || matchesOrderId || matchesUsername;
      });
    }

    const total = returns.length;
    const paginatedReturns = returns.slice(skip, skip + parseInt(limit));

    // Flatten orderId so the frontend can use ret.orderId directly
    const formattedReturns = paginatedReturns.map(ret => ({
      _id: ret._id,
      returnId: ret.returnId,
      orderId: ret.order?.orderId || "Unknown",
      reason: ret.reason,
      comments: ret.comments,
      status: ret.status,
      statusHistory: ret.statusHistory,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
      user: ret.user,
      products: ret.order?.products || []
    }));

    return res.status(200).json({
      success: true,
      returns: formattedReturns,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error getting admin returns:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateReturnStatus = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { status, comment } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const returnRequest = await Return.findById(returnId);
    if (!returnRequest) {
      return res.status(404).json({ message: "Return request not found" });
    }

    // Append to status history
    returnRequest.status = status;
    returnRequest.statusHistory.push({
      status,
      comment: comment || `Status updated to ${status}`,
      timestamp: new Date()
    });

    await returnRequest.save();

    return res.status(200).json({
      success: true,
      message: "Return request status updated successfully",
      returnRequest
    });
  } catch (error) {
    console.error("Error updating return status:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createReturnRequest,
  getUserReturns,
  getAdminReturns,
  updateReturnStatus
};
