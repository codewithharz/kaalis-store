// backend/controllers/sellerController.js
const Product = require("../models/productModels");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModels");
const User = require("../models/userModels");
const Seller = require("../models/sellerModels");
const Order = require("../models/orderModels");
const mongoose = require("mongoose");

// Register a new seller
const registerSeller = async (req, res) => {
  try {
    const { userId, storeName, storeDescription } = req.body;

    // Log incoming data for debugging
    console.log("Request Body:", req.body);

    // Check if the store name already exists
    const existingStore = await Seller.findOne({ storeName: storeName });
    if (existingStore) {
      return res.status(400).json({
        error: "Store name already exists. Please choose a different name.",
      });
    }

    // Check if the user exists and is not already a seller
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isSeller) {
      return res.status(400).json({ error: "User is already a seller" });
    }

    // Create new seller profile
    const newSeller = new Seller({
      user: userId,
      storeName,
      storeDescription,
    });

    await newSeller.save();

    // Update user to reflect seller status
    user.isSeller = true;
    user.sellerProfile = newSeller._id;
    await user.save();

    // res.status(201).json(newSeller);
    res.status(201).json({ user, sellerProfile: newSeller });
  } catch (error) {
    console.error("Error in registerSeller:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Store name already exists. Please choose a different name.",
      });
    }
    res.status(500).json({
      error:
        "An error occurred while registering the seller. Please try again.",
    });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    console.log("Fetching seller profile for ID:", sellerId);

    const seller = await Seller.findById(sellerId)
      .populate("user")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "username" },
      });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Calculate average rating
    if (seller.reviews && seller.reviews.length > 0) {
      const totalRating = seller.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      seller.averageRating = totalRating / seller.reviews.length;
      await seller.save();
    }

    res.json(seller);
  } catch (error) {
    console.error("Error in getSellerProfile:", error);
    res.status(400).json({ error: error.message });
  }
};

const addSellerReview = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const newReview = {
      user: userId,
      rating,
      comment,
    };

    seller.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = seller.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    seller.averageRating = totalRating / seller.reviews.length;

    await seller.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const toggleVacationMode = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    seller.isVacationMode = !seller.isVacationMode;
    await seller.save();

    res.json({ isVacationMode: seller.isVacationMode });
  } catch (error) {
    console.error("Error toggling vacation mode:", error);
    res.status(500).json({ error: "Failed to toggle vacation mode" });
  }
};

// In orderController.js
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

const generateReport = async (req, res) => {
  const startTime = Date.now();
  console.log("[Report Generation] Starting report generation:", {
    sellerId: req.params.sellerId,
    type: req.params.type,
    query: req.query,
  });

  try {
    const { sellerId, type } = req.params;
    const { period, startDate, endDate } = req.query;

    console.log("[Report Generation] Validating seller");
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      console.log("[Report Generation] Seller not found:", sellerId);
      return res.status(404).json({ error: "Seller not found" });
    }

    let dateQuery = {};
    console.log("[Report Generation] Building date query:", {
      period,
      startDate,
      endDate,
    });

    if (period) {
      const now = new Date();
      switch (period) {
        case "today":
          dateQuery = {
            createdAt: {
              $gte: new Date(now.setHours(0, 0, 0, 0)),
              $lte: new Date(now.setHours(23, 59, 59, 999)),
            },
          };
          break;
        case "week":
          dateQuery = {
            createdAt: {
              $gte: new Date(now.setDate(now.getDate() - 7)),
            },
          };
          break;
        case "month":
          dateQuery = {
            createdAt: {
              $gte: new Date(now.setMonth(now.getMonth() - 1)),
            },
          };
          break;
        case "year":
          dateQuery = {
            createdAt: {
              $gte: new Date(now.setFullYear(now.getFullYear() - 1)),
            },
          };
          break;
      }
    } else if (startDate && endDate) {
      dateQuery = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    console.log("[Report Generation] Final date query:", dateQuery);

    let reportData;
    const queryStartTime = Date.now();

    switch (type) {
      case "sales":
        reportData = {
          data: await Order.aggregate([
            {
              $match: {
                seller: seller.user,
                ...dateQuery,
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
                totalSales: { $sum: "$totalAmount" },
                ordersCount: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]),
          summary: {
            totalRevenue: await Order.aggregate([
              {
                $match: {
                  seller: seller.user,
                  ...dateQuery,
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$totalAmount" },
                },
              },
            ]).then((result) => result[0]?.total || 0),
            totalOrders: await Order.countDocuments({
              seller: seller.user,
              ...dateQuery,
            }),
          },
        };
        break;

      case "inventory":
        // Add debugging logs here
        console.log("[Inventory Debug] Seller ID:", seller._id);
        console.log("[Inventory Debug] Seller User ID:", seller.user);

        // Test query to check all products
        const testProducts = await Product.find({}).lean();
        console.log(
          "[Inventory Debug] All products in DB:",
          testProducts.length
        );
        console.log(
          "[Inventory Debug] Sample product schema:",
          testProducts[0]
        );

        // Check products with current seller using both IDs
        const sellerProducts = await Product.find({
          $or: [
            { seller: seller._id }, // Check seller reference
            { user: seller.user }, // Check user reference
          ],
        }).lean();
        console.log(
          "[Inventory Debug] Found seller products:",
          sellerProducts.length
        );

        // Then continue with your existing reportData assignment
        reportData = {
          data: await Product.find({
            $or: [
              { seller: seller._id }, // Check seller reference
              { user: seller.user }, // Check user reference
            ],
          })
            .select("name price quantity createdAt lastRestocked")
            .sort("name")
            .lean(),
          summary: {
            totalProducts: await Product.countDocuments({
              $or: [{ seller: seller._id }, { user: seller.user }],
            }),
            lowStockItems: await Product.countDocuments({
              $or: [{ seller: seller._id }, { user: seller.user }],
              quantity: { $lte: 10 },
            }),
            outOfStockItems: await Product.countDocuments({
              $or: [{ seller: seller._id }, { user: seller.user }],
              quantity: 0,
            }),
          },
        };
        break;

      case "customers":
        reportData = {
          data: await Order.aggregate([
            {
              $match: {
                seller: seller.user,
                ...dateQuery,
              },
            },
            {
              $group: {
                _id: "$user",
                orderCount: { $sum: 1 },
                totalSpent: { $sum: "$totalAmount" },
                lastPurchase: { $max: "$createdAt" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            { $unwind: "$userDetails" },
          ]),
          summary: {
            totalCustomers: await Order.distinct("user", {
              seller: seller.user,
              ...dateQuery,
            }).then((users) => users.length),
          },
        };
        break;

      case "financial":
        reportData = {
          data: await Order.aggregate([
            {
              $match: {
                seller: seller.user,
                ...dateQuery,
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$createdAt",
                  },
                },
                revenue: { $sum: "$totalAmount" },
                orderCount: { $sum: 1 },
                averageOrderValue: { $avg: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ]),
          summary: {
            totalRevenue: await Order.aggregate([
              {
                $match: {
                  seller: seller.user,
                  ...dateQuery,
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$totalAmount" },
                },
              },
            ]).then((result) => result[0]?.total || 0),
          },
        };
        break;

      default:
        console.error("[Report Generation] Invalid report type:", type);
        return res.status(400).json({ error: "Invalid report type" });
    }

    console.log(
      "[Report Generation] Query execution time:",
      Date.now() - queryStartTime,
      "ms"
    );
    console.log("[Report Generation] Report data summary:", {
      type,
      dataLength: reportData.data?.length,
      summary: reportData.summary,
    });

    const report = {
      data: reportData.data,
      summary: reportData.summary,
      reportType: type,
      dateRange: period || { startDate, endDate },
      generatedAt: new Date(),
      seller: {
        storeName: seller.storeName,
        id: seller._id,
      },
      generationTimeMs: Date.now() - startTime,
    };

    // Set proper headers for JSON response
    res.setHeader("Content-Type", "application/json");
    res.json(report);
  } catch (error) {
    console.error("[Report Generation] Error:", {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
    });
    res.status(500).json({
      error: "Failed to generate report",
      details: error.message,
    });
  }
};

const getAllSellerOrders = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerProfile = await Seller.findById(sellerId);
    if (!sellerProfile) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const orders = await Order.find({ seller: sellerProfile.user })
      .sort({ createdAt: -1 })
      .populate("user", "username email phone")
      .populate("products.product", "name price")
      .lean();

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      orderNumber: order._id.toString().slice(-6).toUpperCase(),
      date: order.createdAt.toISOString().split("T")[0],
      status: order.status,
      total: order.totalAmount,
      customerName: order.user?.username || "Unknown",
      customerEmail: order.user?.email || "N/A",
      customerPhone: order.user?.phone || "N/A",
      paymentMethod: order.paymentMethod,
      address: order.address,
      products: order.products.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error in getAllSellerOrders:", error);
    res.status(500).json({ error: "Failed to fetch all seller orders" });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const sellerProfile = await Seller.findById(sellerId);
    if (!sellerProfile) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const orders = await Order.find({ seller: sellerProfile.user })
      .sort({ createdAt: -1 })
      .populate("user", "username email phone")
      .populate("products.product", "name price")
      .lean();

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      orderNumber: order._id.toString().slice(-6).toUpperCase(),
      date: order.createdAt.toISOString().split("T")[0],
      status: order.status,
      total: order.totalAmount,
      customerName: order.user?.username || "Unknown",
      customerEmail: order.user?.email || "N/A",
      customerPhone: order.user?.phone || "N/A",
      paymentMethod: order.paymentMethod,
      address: order.address,
      products: order.products.map((item) => ({
        name: item.product?.name || "Deleted Product",
        price: item.product?.price || 0,
        quantity: item.quantity,
        subtotal: (item.product?.price || 0) * item.quantity,
      })),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error in getSellerOrders:", error);
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const updateData = req.body;

    const seller = await Seller.findByIdAndUpdate(sellerId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json(seller);
  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get seller's products with additional seller details
const getSellerProducts = async (req, res) => {
  try {
    // Find the seller by ID and populate the products field
    const seller = await Seller.findById(req.params.sellerId).populate(
      "products"
    );
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    // Respond with the seller's products
    res.json(seller.products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get seller by ID
const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId).populate("user");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete seller account
const deleteSellerAccount = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Update user to reflect seller status
    const user = await User.findById(seller.user);
    user.isSeller = false;
    user.sellerProfile = null;
    await user.save();

    res.json({ message: "Seller account deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    let sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    console.log("Seller ObjectId:", sellerObjectId);

    // Fetch the seller document
    const seller = await Seller.findById(sellerObjectId).populate("products");
    console.log("Seller:", seller);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const sellerUserId = seller.user;

    // Fetch total sales
    const totalSales = await Order.aggregate([
      { $match: { seller: sellerUserId } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    console.log("Total Sales:", totalSales);

    // Fetch total orders
    const totalOrders = await Order.countDocuments({ seller: sellerUserId });
    console.log("Total Orders:", totalOrders);

    // Get total products from the seller document, filtering out null products
    const totalProducts = seller.products.filter(
      (product) => product != null
    ).length;
    console.log("Total Products:", totalProducts);

    // Fetch total customers (unique customers who have placed orders)
    const totalCustomers = await Order.distinct("user", {
      seller: sellerUserId,
    });
    console.log("Total Customers:", totalCustomers.length);

    // Fetch recent orders with product details
    const recentOrders = await Order.find({ seller: sellerUserId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username")
      .populate("products.product", "name price")
      .lean();
    console.log("Recent Orders:", recentOrders);

    // Calculate revenue growth
    const currentDate = new Date();
    const lastMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );

    const currentMonthSales = await Order.aggregate([
      { $match: { seller: sellerUserId, createdAt: { $gte: lastMonthDate } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const previousMonthSales = await Order.aggregate([
      {
        $match: {
          seller: sellerUserId,
          createdAt: {
            $lt: lastMonthDate,
            $gte: new Date(
              lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
            ),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const currentMonthTotal = currentMonthSales[0]?.total || 0;
    const previousMonthTotal = previousMonthSales[0]?.total || 0;

    const revenueGrowth =
      previousMonthTotal !== 0
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
        : 100;

    // Find top selling product
    const topSellingProduct = await Order.aggregate([
      { $match: { seller: sellerUserId } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          name: { $ifNull: ["$productDetails.name", "Deleted Product"] },
          quantity: "$totalQuantity",
          truncatedName: {
            $substr: [
              { $ifNull: ["$productDetails.name", "Deleted Product"] },
              0,
              20,
            ],
          },
        },
      },
    ]);

    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order._id,
      orderNumber: order._id.toString().slice(-6).toUpperCase(),
      date: order.createdAt.toISOString().split("T")[0],
      status: order.status,
      total: order.totalAmount,
      customerName: order.user?.username || "Unknown",
      products: order.products.map((item) => ({
        name: item.product?.name || "Deleted Product",
        quantity: item.quantity,
        subtotal: (item.product?.price || 0) * item.quantity,
      })),
    }));

    const dashboardData = {
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers: totalCustomers.length,
      recentOrders: formattedRecentOrders,
      revenueGrowth: revenueGrowth.toFixed(2),
      topSellingProduct: topSellingProduct[0] || {
        name: "No data available",
        quantity: 0,
      },
    };

    console.log("Dashboard Data:", dashboardData);

    const pendingOrders = await Order.countDocuments({
      seller: sellerUserId,
      status: "Pending",
    });

    // Add this to the dashboardData object
    dashboardData.pendingOrders = pendingOrders;

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      error: "Failed to fetch dashboard data",
      details: error.message,
    });
  }
};

// ===================================================================
const followSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const userId = req.user._id;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.followers.includes(userId)) {
      return res.status(400).json({ message: "Already following this seller" });
    }

    seller.followers.push(userId);
    await seller.save();

    res.status(200).json({
      message: "Successfully followed seller",
      followersCount: seller.followers.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error following seller", error: error.message });
  }
};

const unfollowSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const userId = req.user._id;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (!seller.followers.includes(userId)) {
      return res.status(400).json({ message: "Not following this seller" });
    }

    seller.followers = seller.followers.filter(
      (followerId) => followerId.toString() !== userId.toString()
    );
    await seller.save();

    res.status(200).json({
      message: "Successfully unfollowed seller",
      followersCount: seller.followers.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unfollowing seller", error: error.message });
  }
};

const getFollowStatus = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const userId = req.user._id;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const isFollowing = seller.followers.includes(userId);

    res
      .status(200)
      .json({ isFollowing, followersCount: seller.followers.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting follow status", error: error.message });
  }
};

const sendMessageToSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { subject, message } = req.body;
    const senderId = req.user._id;

    // Find seller and sender
    const seller = await Seller.findById(sellerId).populate("user");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // Create message
    const newMessage = new Message({
      sender: senderId,
      receiver: seller.user._id,
      subject,
      message,
      relatedSeller: sellerId,
    });
    await newMessage.save();

    // Create notification
    const notification = new Notification({
      user: seller.user._id, // recipient (seller)
      title: "New Message",
      message: `You have a new message from ${sender.username}: ${subject}`,
      type: "System", // or you could add 'Message' to your enum in the model
      priority: "medium",
      actionUrl: `/messages/${newMessage._id}`, // URL where they can view the message
      sender: senderId, // the customer who sent the message
    });
    await notification.save();

    res.status(201).json({
      message: "Message sent successfully",
      data: {
        messageId: newMessage._id,
        notificationId: notification._id,
      },
    });
  } catch (error) {
    console.error("Error sending message to seller:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getFavoriteStores = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all sellers that the user follows
    const favoriteStores = await Seller.find({
      followers: userId,
    })
      .populate("products")
      .select(
        "storeName storeDescription profileImage backgroundImage products averageRating totalSales isVacationMode isVerified reviews followers createdAt updatedAt"
      );

    const formattedStores = favoriteStores.map((store) => ({
      _id: store._id,
      storeName: store.storeName,
      storeDescription: store.storeDescription,
      profileImage: store.profileImage,
      backgroundImage: store.backgroundImage,
      totalProducts: store.products.length,
      averageRating: store.averageRating || 0,
      totalSales: store.totalSales,
      isVacationMode: store.isVacationMode,
      isVerified: store.isVerified,
      totalReviews: store.reviews?.length || 0,
      followers: store.followers?.length || 0,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    }));

    res.status(200).json(formattedStores);
  } catch (error) {
    console.error("Error fetching favorite stores:", error);
    res
      .status(500)
      .json({ message: "Error getting favorite stores", error: error.message });
  }
};

// ===================================================

// use this for 24 hour cooldown period
// const requestVerification = async (req, res) => {
//   try {
//     const sellerId = req.params.sellerId;
//     const seller = await Seller.findById(sellerId);
//     if (!seller) {
//       return res.status(404).json({ error: "Seller not found" });
//     }
//     if (seller.verificationStatus === "approved") {
//       return res.status(400).json({ error: "Seller is already verified" });
//     }
//     if (["submitted", "under_review"].includes(seller.verificationStatus)) {
//       return res
//         .status(400)
//         .json({ error: "Verification request is already in progress" });
//     }
//     const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//     if (
//       seller.lastVerificationRequest &&
//       Date.now() - seller.lastVerificationRequest.getTime() < cooldownPeriod
//     ) {
//       return res
//         .status(400)
//         .json({ error: "Please wait before requesting verification again" });
//     }
//     seller.lastVerificationRequest = new Date();
//     seller.verificationStatus = "submitted";
//     await seller.save();
//     res.status(200).json({
//       message: "Verification request submitted successfully",
//       verificationStatus: seller.verificationStatus,
//     });
//   } catch (error) {
//     console.error("Error in requestVerification:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while requesting verification" });
//   }
// };

// use this for 5 minute cooldown period
const requestVerification = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Check current status
    if (seller.verificationStatus === "approved") {
      return res.status(400).json({ error: "Seller is already verified" });
    }

    if (["submitted", "under_review"].includes(seller.verificationStatus)) {
      return res.status(400).json({
        error: "Verification request is already in progress",
      });
    }

    // Check cooldown period (5 minutes for testing)
    const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (
      seller.lastVerificationRequest &&
      Date.now() - new Date(seller.lastVerificationRequest).getTime() <
        cooldownPeriod
    ) {
      const remainingTime = Math.ceil(
        (cooldownPeriod -
          (Date.now() - new Date(seller.lastVerificationRequest).getTime())) /
          1000
      );
      return res.status(400).json({
        error: "Please wait before requesting verification again",
        remainingTime: remainingTime,
      });
    }

    // Update seller verification status
    seller.lastVerificationRequest = new Date();
    seller.verificationStatus = "submitted";
    await seller.save();

    res.status(200).json({
      message: "Verification request submitted successfully",
      verificationStatus: seller.verificationStatus,
      lastVerificationRequest: seller.lastVerificationRequest,
    });
  } catch (error) {
    console.error("Error in requestVerification:", error);
    res.status(500).json({
      error: "An error occurred while requesting verification",
    });
  }
};

// Update verification status (for admin use)
const updateVerificationStatus = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.body;
    const adminId = req.user._id;

    if (!["under_review", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid verification status" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    seller.verificationStatus = status;
    if (status === "approved" || status === "rejected") {
      seller.verificationDate = new Date();
      seller.verifiedBy = adminId;
    }

    await seller.save();
    res.status(200).json({
      message: `Seller verification status updated to ${status}`,
      seller,
    });
  } catch (error) {
    console.error("Error in updateVerificationStatus:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating verification status" });
  }
};

// Get pending verifications (for admin use)
const getPendingVerifications = async (req, res) => {
  try {
    const pendingSellers = await Seller.find({
      verificationStatus: { $in: ["submitted", "under_review"] },
    })
      .populate("user", "username email")
      .select("storeName storeDescription verificationStatus");
    res.status(200).json(pendingSellers);
  } catch (error) {
    console.error("Error in getPendingVerifications:", error);
    res.status(500).json({
      error: "An error occurred while fetching pending verifications",
    });
  }
};

// Cancel verification request
const cancelVerificationRequest = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    if (!["submitted", "under_review"].includes(seller.verificationStatus)) {
      return res
        .status(400)
        .json({ error: "No active verification request to cancel" });
    }

    seller.verificationStatus = "not_submitted";
    await seller.save();
    res
      .status(200)
      .json({ message: "Verification request cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelVerificationRequest:", error);
    res.status(500).json({
      error: "An error occurred while cancelling the verification request",
    });
  }
};

module.exports = {
  registerSeller,
  getSellerProfile,
  addSellerReview,
  toggleVacationMode,
  updateOrderStatus,

  generateReport,

  getAllSellerOrders,
  getSellerOrders,
  updateSellerProfile,
  getSellerProducts,
  getSellerById,
  deleteSellerAccount,
  getDashboardData,

  followSeller,
  unfollowSeller,
  getFollowStatus,
  sendMessageToSeller,
  getFavoriteStores,
  requestVerification,
  updateVerificationStatus,
  getPendingVerifications,
  cancelVerificationRequest,
};
