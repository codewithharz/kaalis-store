// backend/controllers/adminDashboardController.js

// Admin dashboard features and managing other users/entities
const User = require("../models/userModels");
const Seller = require("../models/sellerModels");
const { createSystemNotification } = require("../utils/notificationUtils");
const Product = require("../models/productModels");
const Order = require("../models/orderModels");
const Category = require("../models/categoryModels");
const Payment = require("../models/paymentModels");
const VendorPayout = require("../models/vendorPayoutModels");
const {
  applyOrderRewards,
  reverseOrderRewards,
} = require("../services/orderRewardService");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const {
  sendAdminTriggeredPasswordResetEmail,
} = require("../services/emailService");
const mongoose = require("mongoose");

const normalizePaymentCurrency = (currency) => {
  return currency === "XOF" ? "XOF" : "NGN";
};

const applyAdminPaymentDateRange = (query, dateRange) => {
  const range = (dateRange || "month").toLowerCase();
  if (!range || range === "all") {
    return;
  }

  const now = new Date();
  const startDate = new Date();

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "quarter":
      startDate.setMonth(startDate.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      return;
  }

  query.createdAt = {
    $gte: startDate,
    $lte: now,
  };
};

const buildAdminPaymentQuery = async (params = {}) => {
  const query = {};
  const status = (params.status || "").trim().toLowerCase();
  const paymentMethod = (params.paymentMethod || "").trim();
  const currency = (params.currency || "").trim().toUpperCase();
  const search = (params.search || "").trim();

  if (status) {
    query.status = status === "completed" ? "success" : status;
  }

  if (paymentMethod) {
    query.paymentMethod = { $regex: new RegExp(`^${paymentMethod}$`, "i") };
  }

  if (currency) {
    if (currency === "NGN") {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { currency: "NGN" },
            { currency: "ngn" },
            { currency: { $exists: false } },
            { currency: null },
            { currency: "" },
          ],
        },
      ];
    } else {
      query.currency = currency;
    }
  }

  applyAdminPaymentDateRange(query, params.dateRange);

  if (search) {
    const [matchingUsers, matchingOrders] = await Promise.all([
      User.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      })
        .select("_id")
        .limit(50)
        .lean(),
      Order.find({
        orderId: { $regex: search, $options: "i" },
      })
        .select("_id")
        .limit(50)
        .lean(),
    ]);

    const userIds = matchingUsers.map((user) => user._id);
    const orderIds = matchingOrders.map((order) => order._id);

    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { reference: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "metadata.userEmail": { $regex: search, $options: "i" } },
          { "metadata.userId": { $in: userIds } },
          { orderId: { $in: orderIds } },
        ],
      },
    ];
  }

  return query;
};

const mapAdminPayment = (paymentDoc) => {
  const payment = paymentDoc.toObject ? paymentDoc.toObject() : paymentDoc;
  const user = payment.metadata?.userId;
  const order = payment.orderId;
  const customerName =
    user?.username ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    payment.email;

  return {
    id: payment._id,
    paymentId: payment.reference || payment._id.toString(),
    reference: payment.reference || null,
    orderId: order?._id || payment.orderId || null,
    orderNumber: order?.orderId || null,
    customerName,
    customerEmail: user?.email || payment.email || payment.metadata?.userEmail || "",
    amount: payment.amount || 0,
    currency: normalizePaymentCurrency(payment.currency || order?.currency),
    status: payment.status || "pending",
    paymentMethod: payment.paymentMethod || "Paystack",
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
};

const toCsvCell = (value) => {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

// backend/controllers/adminDashboardController.js
exports.getDashboardStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    // Get current period counts
    const [currentUsers, currentProducts, currentOrders, currentRevenue] =
      await Promise.all([
        User.countDocuments({
          createdAt: { $gte: previousStartDate, $lte: endDate },
        }),
        Product.countDocuments({
          createdAt: { $gte: previousStartDate, $lte: endDate },
        }),
        Order.countDocuments({
          createdAt: { $gte: previousStartDate, $lte: endDate },
        }),
        Payment.aggregate([
          {
            $match: {
              status: "success",
              createdAt: { $gte: previousStartDate, $lte: endDate },
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

    // Get previous period counts
    const previousPeriodStart = new Date(previousStartDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);

    const [prevUsers, prevProducts, prevOrders, prevRevenue] =
      await Promise.all([
        User.countDocuments({
          createdAt: {
            $gte: previousPeriodStart,
            $lt: previousStartDate,
          },
        }),
        Product.countDocuments({
          createdAt: {
            $gte: previousPeriodStart,
            $lt: previousStartDate,
          },
        }),
        Order.countDocuments({
          createdAt: {
            $gte: previousPeriodStart,
            $lt: previousStartDate,
          },
        }),
        Payment.aggregate([
          {
            $match: {
              status: "success",
              createdAt: {
                $gte: previousPeriodStart,
                $lt: previousStartDate,
              },
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

    // Calculate growth rates
    const calculateGrowth = (current, previous) => {
      return previous === 0
        ? current > 0
          ? 100
          : 0
        : ((current - previous) / previous) * 100;
    };

    // Calculate total counts
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    // Get daily stats for the period
    const [userStats, orderStats, productStats, revenueStats] =
      await Promise.all([
        // User stats by day
        User.aggregate([
          {
            $match: {
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // Order stats by day
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // Product stats by day
        Product.aggregate([
          {
            $match: {
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),

        // Revenue stats by day
        Payment.aggregate([
          {
            $match: {
              status: "success",
              createdAt: { $gte: previousStartDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              value: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    // Format the response
    const formatStats = (stats) =>
      stats.map((stat) => ({
        date: stat._id,
        value: stat.value,
      }));

    // Calculate growth percentages
    const currentPeriodStats = {
      users: userStats.reduce((sum, stat) => sum + stat.value, 0),
      orders: orderStats.reduce((sum, stat) => sum + stat.value, 0),
      products: productStats.reduce((sum, stat) => sum + stat.value, 0),
      revenue: revenueStats.reduce((sum, stat) => sum + stat.value, 0),
    };

    const previousPeriod = await Promise.all([
      User.countDocuments({
        createdAt: {
          $lt: previousStartDate,
          $gte: new Date(
            previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
          ),
        },
      }),
      Order.countDocuments({
        createdAt: {
          $lt: previousStartDate,
          $gte: new Date(
            previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
          ),
        },
      }),
      Product.countDocuments({
        createdAt: {
          $lt: previousStartDate,
          $gte: new Date(
            previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
          ),
        },
      }),
      Payment.aggregate([
        {
          $match: {
            status: "success",
            createdAt: {
              $lt: previousStartDate,
              $gte: new Date(
                previousStartDate.getTime() - days * 24 * 60 * 60 * 1000
              ),
            },
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

    const growth = {
      users: calculateGrowth(currentPeriodStats.users, previousPeriod[0]),
      orders: calculateGrowth(currentPeriodStats.orders, previousPeriod[1]),
      products: calculateGrowth(currentPeriodStats.products, previousPeriod[2]),
      revenue: calculateGrowth(
        currentPeriodStats.revenue,
        previousPeriod[3][0]?.total || 0
      ),
    };

    // Calculate popular products (top 5 by sales count from Orders)
    const popularProductsRaw = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          sales: { $sum: "$products.quantity" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);

    const popularProducts = [];
    for (const item of popularProductsRaw) {
      if (item._id) {
        const prod = await Product.findById(item._id)
          .populate("category", "name")
          .lean();
        if (prod) {
          popularProducts.push({
            id: prod._id,
            name: prod.name,
            category: prod.category?.name || "Uncategorized",
            price: prod.price || 0,
            sales: item.sales,
            image: prod.images?.[0] || prod.image || "/placeholder.jpg",
          });
        }
      }
    }

    if (popularProducts.length === 0) {
      const recentProds = await Product.find()
        .populate("category", "name")
        .limit(5)
        .lean();
      recentProds.forEach(prod => {
        popularProducts.push({
          id: prod._id,
          name: prod.name,
          category: prod.category?.name || "Uncategorized",
          price: prod.price || 0,
          sales: 0,
          image: prod.images?.[0] || prod.image || "/placeholder.jpg",
        });
      });
    }

    // Generate recent activities from actual recent orders and user registrations
    const [recentOrders, recentUsers] = await Promise.all([
      Order.find()
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const activities = [];

    recentOrders.forEach((order) => {
      const customerName = order.user
        ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() || order.user.email
        : "Guest";
      activities.push({
        id: `order-${order._id}`,
        message: `Order received: #${order.orderId} from ${customerName}`,
        time: order.createdAt,
        timestamp: new Date(order.createdAt).getTime(),
        icon: "ShoppingCart",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
      });
    });

    recentUsers.forEach((user) => {
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "New User";
      activities.push({
        id: `user-${user._id}`,
        message: `User registered: ${name}`,
        time: user.createdAt,
        timestamp: new Date(user.createdAt).getTime(),
        icon: "Users",
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
      });
    });

    // Sort combined activities by timestamp desc
    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activities.slice(0, 5).map((act) => {
      const diff = Date.now() - act.timestamp;
      let timeStr = new Date(act.time).toLocaleDateString();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) {
        timeStr = "just now";
      } else if (minutes < 60) {
        timeStr = `${minutes} min ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          timeStr = `${hours} hours ago`;
        }
      }
      return {
        id: act.id,
        message: act.message,
        time: timeStr,
        icon: act.icon,
        bgColor: act.bgColor,
        iconColor: act.iconColor,
      };
    });

    res.json({
      stats: {
        totalUsers: currentUsers,
        totalProducts: currentProducts,
        totalOrders: currentOrders,
        totalRevenue: currentRevenue[0]?.total || 0,
        userGrowth: parseFloat(
          calculateGrowth(currentUsers, prevUsers).toFixed(2)
        ),
        productGrowth: parseFloat(
          calculateGrowth(currentProducts, prevProducts).toFixed(2)
        ),
        orderGrowth: parseFloat(
          calculateGrowth(currentOrders, prevOrders).toFixed(2)
        ),
        revenueGrowth: parseFloat(
          calculateGrowth(
            currentRevenue[0]?.total || 0,
            prevRevenue[0]?.total || 0
          ).toFixed(2)
        ),
        avgUsers: parseFloat((currentUsers / days).toFixed(2)),
        avgOrders: parseFloat((currentOrders / days).toFixed(2)),
        avgProducts: parseFloat((currentProducts / days).toFixed(2)),
        avgRevenue: parseFloat(
          ((currentRevenue[0]?.total || 0) / days).toFixed(2)
        ),
      },
      userStats: formatStats(userStats),
      orderStats: formatStats(orderStats),
      productStats: formatStats(productStats),
      revenueStats: formatStats(revenueStats),
      recentActivities,
      popularProducts,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      seller,
      createdFrom,
      createdTo,
      stock,
      status,
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (seller) {
      const sellerDoc = await Seller.findById(seller).select("_id user").lean();
      if (!sellerDoc) {
        return res.json({
          products: [],
          pagination: {
            total: 0,
            pages: 0,
            currentPage: parsedPage,
            limit: parsedLimit,
          },
        });
      }

      const sellerMatch = {
        $or: [{ seller: sellerDoc._id }, { user: sellerDoc.user }],
      };

      if (query.$or) {
        const existingSearchOr = query.$or;
        delete query.$or;
        query.$and = [{ $or: existingSearchOr }, sellerMatch];
      } else {
        query.$or = sellerMatch.$or;
      }
    }

    if (status === "active") {
      query.isAvailable = true;
    } else if (status === "inactive") {
      query.isAvailable = false;
    }

    if (stock === "in_stock") {
      query.stock = { $gt: 10 };
    } else if (stock === "low_stock") {
      query.stock = { $gt: 0, $lte: 10 };
    } else if (stock === "out_of_stock") {
      query.stock = { $lte: 0 };
    }

    if (createdFrom || createdTo) {
      const createdAt = {};

      if (createdFrom) {
        const fromDate = new Date(createdFrom);
        if (!Number.isNaN(fromDate.getTime())) {
          fromDate.setHours(0, 0, 0, 0);
          createdAt.$gte = fromDate;
        }
      }

      if (createdTo) {
        const toDate = new Date(createdTo);
        if (!Number.isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          createdAt.$lte = toDate;
        }
      }

      if (Object.keys(createdAt).length > 0) {
        query.createdAt = createdAt;
      }
    }

    const products = await Product.find(query)
      .populate("category")
      .populate("seller", "storeName")
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();

    const total = await Product.countDocuments(query);

    const normalizedProducts = products.map((product) => ({
      ...product,
      status: product.isAvailable ? "active" : "inactive",
    }));

    res.json({
      products: normalizedProducts,
      pagination: {
        total,
        pages: Math.ceil(total / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

exports.createAdminProduct = async (req, res) => {
  try {
    const {
      sellerId,
      imageUrl,
      status = "active",
      ...productData
    } = req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller is required" });
    }

    const seller = await Seller.findById(sellerId).populate("user", "_id isSeller sellerProfile");
    if (!seller || !seller.user?._id) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (!productData.name?.trim()) {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (!productData.description?.trim()) {
      return res.status(400).json({ message: "Product description is required" });
    }

    if (!productData.category) {
      return res.status(400).json({ message: "Category is required" });
    }

    if (!productData.images || !Array.isArray(productData.images)) {
      productData.images = [];
    }

    const normalizedImages = [
      ...new Set(
        [...productData.images, imageUrl]
          .filter((value) => typeof value === "string")
          .map((value) => value.trim())
          .filter(Boolean)
      ),
    ];

    if (normalizedImages.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    productData.images = normalizedImages;

    if (productData.color && typeof productData.color === "string") {
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(productData.color)) {
        return res.status(400).json({ message: "Invalid main color hex code" });
      }
    }

    if (productData.availableColors && Array.isArray(productData.availableColors)) {
      for (const color of productData.availableColors) {
        if (!color.name || !color.hexCode) {
          return res.status(400).json({ message: "Each color must have both name and hex code" });
        }
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hexCode)) {
          return res.status(400).json({ message: `Invalid hex code for color: ${color.name}` });
        }
      }
    }

    if (productData.variants && Array.isArray(productData.variants)) {
      for (const variant of productData.variants) {
        if (variant.color) {
          if (!variant.color.name || !variant.color.hexCode) {
            return res.status(400).json({
              message: "Each variant color must have both name and hex code",
            });
          }
          if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(variant.color.hexCode)) {
            return res.status(400).json({
              message: `Invalid hex code for variant color: ${variant.color.name}`,
            });
          }
        }
      }
    }

    let categoryId;
    if (mongoose.Types.ObjectId.isValid(productData.category)) {
      categoryId = new mongoose.Types.ObjectId(productData.category);
    } else {
      let existingCategory = await Category.findOne({
        name: productData.category,
      });
      if (!existingCategory) {
        const newCategory = new Category({
          name: productData.category,
          slug: productData.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
        existingCategory = await newCategory.save();
      }
      categoryId = existingCategory._id;
    }

    const baseSlug = productData.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product";
    const slug = `${baseSlug}-${Date.now()}`;

    const product = new Product({
      ...productData,
      name: productData.name.trim(),
      description: productData.description.trim(),
      category: categoryId,
      images: productData.images,
      slug,
      user: seller.user._id,
      seller: seller._id,
      isAvailable: status === "active",
    });

    const savedProduct = await product.save();

    await User.findByIdAndUpdate(seller.user._id, {
      $addToSet: { products: savedProduct._id },
    });

    await Seller.findByIdAndUpdate(seller._id, {
      $addToSet: { products: savedProduct._id },
    });

    const populatedProduct = await Product.findById(savedProduct._id)
      .populate("category")
      .lean();

    res.status(201).json({
      ...populatedProduct,
      status: populatedProduct.isAvailable ? "active" : "inactive",
    });
  } catch (error) {
    console.error("Error creating admin product:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatePayload = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updatePayload, "status")) {
      updatePayload.isAvailable = updatePayload.status === "active";
      delete updatePayload.status;
    }

    if (typeof updatePayload.imageUrl === "string") {
      const normalizedImageUrl = updatePayload.imageUrl.trim();
      if (normalizedImageUrl) {
        updatePayload.images = [normalizedImageUrl];
      }
      delete updatePayload.imageUrl;
    }

    delete updatePayload.sellerId;

    const product = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      ...product.toObject(),
      status: product.isAvailable ? "active" : "inactive",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// Category Management
exports.getAdminCategories = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      // Search in English name OR French translation name
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "translations.fr.name": { $regex: search, $options: "i" } },
      ];
    }

    const categories = await Category.find(query).sort({ level: 1, name: 1 }).lean();

    // Load all categories for ancestors mapping to ensure correct cumulative counts
    const allCategories = await Category.find({}, "_id parent ancestors").lean();

    // Aggregate product counts per category in a single query
    const productCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Build category map of _id to ancestors list
    const categoryMap = {};
    allCategories.forEach((c) => {
      categoryMap[String(c._id)] = {
        ancestors: (c.ancestors || []).map((anc) => String(anc)),
      };
    });

    const countMap = {};
    productCounts.forEach((p) => {
      if (!p._id) return;
      const catIdStr = String(p._id);
      const count = p.count;

      // Add to direct category count
      countMap[catIdStr] = (countMap[catIdStr] || 0) + count;

      // Add to all ancestor category counts
      const catInfo = categoryMap[catIdStr];
      if (catInfo && catInfo.ancestors) {
        catInfo.ancestors.forEach((ancId) => {
          countMap[ancId] = (countMap[ancId] || 0) + count;
        });
      }
    });

    // Attach productsCount to each returned category
    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      productsCount: countMap[String(cat._id)] || 0,
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};


exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent, active, translations } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Build the slug
    let slugParts = [name.toLowerCase().replace(/[^a-z0-9]+/g, "-")];
    let level = 0;
    let ancestors = [];

    if (parent) {
      const parentCategory = await Category.findById(parent).lean();
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
      // Resolve full ancestor chain
      ancestors = [...(parentCategory.ancestors || []), parentCategory._id];
      level = ancestors.length;
      // Prepend parent's slug prefix
      slugParts = [parentCategory.slug, ...slugParts];
    }

    const slug = slugParts.join("-");

    // Check for duplicate slug
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "A category with this name already exists under the same parent" });
    }

    const newCategory = new Category({
      name: name.trim(),
      slug,
      description: description || "",
      parent: parent || null,
      level,
      ancestors,
      active: active !== undefined ? active : true,
      translations: translations || {},
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description, parent, active, translations } = req.body;

    const existing = await Category.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Build update payload
    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (description !== undefined) update.description = description;
    if (active !== undefined) update.active = active;

    // Merge translations deeply so partial updates don't wipe existing translations
    if (translations) {
      update.translations = {
        ...(existing.translations ? existing.translations.toObject ? existing.translations.toObject() : existing.translations : {}),
        ...translations,
      };
      if (translations.fr) {
        update["translations.fr"] = {
          ...(existing.translations?.fr || {}),
          ...translations.fr,
        };
        delete update.translations;
        update["translations.fr"] = {
          ...(existing.translations?.fr || {}),
          ...translations.fr,
        };
      }
    }

    // Re-generate slug and hierarchy if name or parent changed
    const nameChanged = name !== undefined && name.trim() !== existing.name;
    const parentChanged = parent !== undefined && String(parent || "") !== String(existing.parent || "");

    if (nameChanged || parentChanged) {
      const resolvedParent = parent !== undefined ? parent : existing.parent;
      let slugParts = [(name || existing.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")];
      let level = 0;
      let ancestors = [];

      if (resolvedParent) {
        const parentCategory = await Category.findById(resolvedParent).lean();
        if (!parentCategory) {
          return res.status(404).json({ message: "Parent category not found" });
        }
        ancestors = [...(parentCategory.ancestors || []), parentCategory._id];
        level = ancestors.length;
        slugParts = [parentCategory.slug, ...slugParts];
      }

      update.slug = slugParts.join("-");
      update.level = level;
      update.ancestors = ancestors;
      update.parent = resolvedParent || null;
    }

    const category = await Category.findByIdAndUpdate(id, { $set: update }, { new: true });
    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if category has associated products
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({
        message: "Cannot delete category with associated products",
      });
    }

    // Check if it has subcategories
    const subcategoriesCount = await Category.countDocuments({ parent: id });
    if (subcategoriesCount > 0) {
      return res.status(400).json({
        message: "Cannot delete category that has subcategories. Delete subcategories first.",
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

// Order Management
exports.getAdminOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      currency,
      search,
      dateFrom,
      dateTo,
    } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Add filters if they exist
    if (status) {
      query.status = status;
    }

    if (currency) {
      const normalizedCurrency = currency.toUpperCase();
      if (normalizedCurrency === "NGN") {
        query.$and = [
          ...(query.$and || []),
          {
            $or: [
              { currency: "NGN" },
              { currency: "ngn" },
              { currency: { $exists: false } },
              { currency: null },
              { currency: "" },
            ],
          },
        ];
      } else {
        query.currency = normalizedCurrency;
      }
    }

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      })
        .select("_id")
        .limit(50)
        .lean();

      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
        { user: { $in: matchingUsers.map((user) => user._id) } },
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "username email")
        .populate({
          path: "seller",
          select: "username email sellerProfile",
          populate: {
            path: "sellerProfile",
            select: "storeName isVerified averageRating totalReviews",
          },
        })
        .populate("appliedCoupon", "code type value")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query),
    ]);

    const orderIds = orders.map((order) => order._id);
    const [payouts, payments] = orderIds.length
      ? await Promise.all([
          VendorPayout.find({ orderId: { $in: orderIds } })
            .select(
              "orderId status paymentMethod amount currency scheduledDate processedAt transferReference providerPayoutId providerStatus errorMessage createdAt updatedAt"
            )
            .sort({ createdAt: -1 })
            .lean(),
          Payment.find({ orderId: { $in: orderIds } })
            .select("orderId reference amount currency status paymentMethod createdAt updatedAt")
            .sort({ createdAt: -1 })
            .lean(),
        ])
      : [[], []];

    const payoutByOrderId = new Map();
    for (const payout of payouts) {
      const key = payout.orderId?.toString();
      if (key && !payoutByOrderId.has(key)) {
        payoutByOrderId.set(key, payout);
      }
    }

    const paymentByOrderId = new Map();
    for (const payment of payments) {
      const key = payment.orderId?.toString();
      if (key && !paymentByOrderId.has(key)) {
        paymentByOrderId.set(key, {
          id: payment._id,
          reference: payment.reference || payment._id?.toString(),
          amount: payment.amount || 0,
          currency: normalizePaymentCurrency(payment.currency),
          status: payment.status || "pending",
          paymentMethod: payment.paymentMethod || "Paystack",
          createdAt: payment.createdAt,
        });
      }
    }

    const ordersWithAdminContext = orders.map((order) => {
      const plainOrder = order.toObject();
      return {
        ...plainOrder,
        paymentSummary: paymentByOrderId.get(order._id.toString()) || null,
        payoutSummary: payoutByOrderId.get(order._id.toString()) || null,
      };
    });

    // ─── Calculate Stats Summary for all orders matching the query ───
    const summary = {
      totalRevenue: { NGN: 0, XOF: 0 },
      totalPlatformFees: { NGN: 0, XOF: 0 },
      totalShippingFees: { NGN: 0, XOF: 0 },
      averageOrderValue: { NGN: 0, XOF: 0 },
      todayOrders: 0,
      processingToday: 0,
      paymentMethodStats: [],
      periods: {
        today: { orders: 0, revenue: { NGN: 0, XOF: 0 } },
        week: { orders: 0, revenue: { NGN: 0, XOF: 0 } },
        month: { orders: 0, revenue: { NGN: 0, XOF: 0 } },
        year: { orders: 0, revenue: { NGN: 0, XOF: 0 } },
      },
    };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setMonth(now.getMonth() - 1);

    const yearStart = new Date(now);
    yearStart.setFullYear(now.getFullYear() - 1);

    const [financialStats, processingTodayCount, paymentStats] = await Promise.all([
      Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $toUpper: { $ifNull: ["$currency", "NGN"] } },
            // Today
            todayRevenue: {
              $sum: { $cond: [{ $gte: ["$createdAt", todayStart] }, "$totalAmount", 0] },
            },
            todayCount: {
              $sum: { $cond: [{ $gte: ["$createdAt", todayStart] }, 1, 0] },
            },
            // Week
            weekRevenue: {
              $sum: { $cond: [{ $gte: ["$createdAt", weekStart] }, "$totalAmount", 0] },
            },
            weekCount: {
              $sum: { $cond: [{ $gte: ["$createdAt", weekStart] }, 1, 0] },
            },
            // Month
            monthRevenue: {
              $sum: { $cond: [{ $gte: ["$createdAt", monthStart] }, "$totalAmount", 0] },
            },
            monthCount: {
              $sum: { $cond: [{ $gte: ["$createdAt", monthStart] }, 1, 0] },
            },
            // Year
            yearRevenue: {
              $sum: { $cond: [{ $gte: ["$createdAt", yearStart] }, "$totalAmount", 0] },
            },
            yearCount: {
              $sum: { $cond: [{ $gte: ["$createdAt", yearStart] }, 1, 0] },
            },
            // Global
            totalRevenue: { $sum: "$totalAmount" },
            totalPlatformFees: { $sum: "$platformFee" },
            totalShippingFees: { $sum: "$shippingFee" },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
      ]),
      Order.countDocuments({
        ...query,
        status: "Processing",
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),
      Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    financialStats.forEach((stat) => {
      const cur = stat._id === "XOF" ? "XOF" : "NGN";
      summary.totalRevenue[cur] = stat.totalRevenue || 0;
      summary.totalPlatformFees[cur] = stat.totalPlatformFees || 0;
      summary.totalShippingFees[cur] = stat.totalShippingFees || 0;
      summary.averageOrderValue[cur] = stat.avgOrderValue || 0;

      // Period stats counts
      summary.periods.today.orders += stat.todayCount || 0;
      summary.periods.week.orders += stat.weekCount || 0;
      summary.periods.month.orders += stat.monthCount || 0;
      summary.periods.year.orders += stat.yearCount || 0;

      // Period stats revenues
      summary.periods.today.revenue[cur] = stat.todayRevenue || 0;
      summary.periods.week.revenue[cur] = stat.weekRevenue || 0;
      summary.periods.month.revenue[cur] = stat.monthRevenue || 0;
      summary.periods.year.revenue[cur] = stat.yearRevenue || 0;
    });

    summary.todayOrders = summary.periods.today.orders;
    summary.processingToday = processingTodayCount;
    summary.paymentMethodStats = paymentStats.map((item) => ({
      name: item._id || "Unknown",
      value: item.count || 0,
    }));

    res.status(200).json({
      orders: ordersWithAdminContext,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      summary,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id).populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;
    order.status = status;

    if (status === "Processing" && previousStatus !== "Processing") {
      await applyOrderRewards(order);
    }

    if (status === "Cancelled" && previousStatus !== "Cancelled") {
      if (order.products?.length) {
        await Promise.all(
          order.products.map((item) =>
            Product.findByIdAndUpdate(item.product, {
              $inc: { quantity: item.quantity },
            })
          )
        );
      }
      await reverseOrderRewards(order, "Order cancelled by admin");
      order.cancelledAt = new Date();
      order.cancelReason = "Cancelled by admin";
    }

    await order.save();

    // You might want to send notifications here
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

// Regular User Management
exports.getRegularUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

exports.updateRegularUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

exports.deleteRegularUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Regular User Actions
exports.toggleBlockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    if (!user.isBlocked) {
      user.failedLoginAttempts = 0;
      user.lastFailedLogin = null;
    }

    if (user.isBlocked) {
      // Force logout when blocking
      user.isOnline = false;
      user.sessionId = null;
    }

    await user.save();

    // Log this admin action
    await logUserActivity(
      id,
      user.isBlocked ? "account_blocked" : "account_unblocked",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling user block status",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tempPassword = crypto.randomBytes(8).toString("hex");
    user.password = await bcrypt.hash(tempPassword, 10);
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendAdminTriggeredPasswordResetEmail({
      to: user.email,
      username: user.username,
      tempPassword,
      locale: user.preferredLanguage,
      accountType: "user",
    });

    // Log password reset
    await logUserActivity(id, "password_reset", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
    });

    res.json({
      success: true,
      message: "Password reset successful. Email sent to user.",
      tempPassword, // Keep this for UI display
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

exports.getUserActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedActivities = (user.actions || []).map((activity) => ({
      id: activity._id,
      action: activity.action,
      timestamp: activity.timestamp,
      details: activity.details,
      ip: activity.ip,
      formattedDate: new Date(activity.timestamp).toLocaleString(),
    }));

    res.json({
      success: true,
      activities: formattedActivities.sort((a, b) => b.timestamp - a.timestamp),
    });
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({
      message: "Error fetching activity log",
      error: error.message,
    });
  }
};

exports.toggle2FAUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.twoFactorEnabled = !user.twoFactorEnabled;
    if (user.twoFactorEnabled) {
      user.twoFactorSecret = crypto.randomBytes(32).toString("hex");
    } else {
      user.twoFactorSecret = null;
    }

    await user.save();

    // Log this admin action
    await logUserActivity(
      id,
      user.twoFactorEnabled ? "2fa_enabled" : "2fa_disabled",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `2FA ${user.twoFactorEnabled ? "enabled" : "disabled"
        } successfully`,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error toggling 2FA",
      error: error.message,
    });
  }
};

exports.forceLogoutUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isOnline = false;
    user.sessionId = null;
    await user.save();

    // Log the forced logout
    await logUserActivity(id, "forced_logout", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
      reason: req.body.reason || "Admin action",
    });

    res.json({
      success: true,
      message: "User forced to logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error forcing user logout",
      error: error.message,
    });
  }
};

exports.updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.permissions = permissions;
    await user.save();

    res.json({
      success: true,
      message: "User permissions updated successfully",
      permissions: user.permissions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user permissions",
      error: error.message,
    });
  }
};

// In adminDashboardController.js

exports.getRevenueStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30; // Default to 30 days

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    console.log("Date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days,
    });

    // Get all payments within the date range
    const payments = await Payment.find({
      status: "success",
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: 1 });

    console.log(`Found ${payments.length} payments in date range`);

    // Group payments by date
    const dailyRevenue = payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {});

    // Fill in the data array with amounts for each date
    const revenueData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      revenueData.push({
        date: dateStr,
        amount: dailyRevenue[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate summary statistics
    const totalRevenue = revenueData.reduce((sum, day) => sum + day.amount, 0);
    const averageDaily = totalRevenue / revenueData.length;

    // Calculate previous period for growth comparison
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);

    const previousPeriodRevenue = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: {
            $gte: previousStartDate,
            $lte: previousEndDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const previousTotal = previousPeriodRevenue[0]?.total || 0;
    const growth =
      previousTotal !== 0
        ? ((totalRevenue - previousTotal) / previousTotal) * 100
        : 0;

    console.log("Revenue summary:", {
      totalRevenue,
      averageDaily,
      growth,
      dataPoints: revenueData.length,
      firstDay: revenueData[0]?.date,
      lastDay: revenueData[revenueData.length - 1]?.date,
    });

    res.json({
      success: true,
      revenueData,
      summary: {
        totalRevenue,
        averageDaily,
        growth: parseFloat(growth.toFixed(2)),
        daysAnalyzed: days,
      },
    });
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue statistics",
      error: error.message,
    });
  }
};

exports.getAdminPayments = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const query = await buildAdminPaymentQuery(req.query);

    const statsQuery = { ...query };
    delete statsQuery.status;

    const [payments, total, summary] = await Promise.all([
      Payment.find(query)
        .populate("orderId", "orderId totalAmount currency status paymentMethod")
        .populate("metadata.userId", "username email firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(query),
      Payment.aggregate([
        { $match: statsQuery },
        {
          $group: {
            _id: {
              status: "$status",
              currency: {
                $cond: [{ $eq: ["$currency", "XOF"] }, "XOF", "NGN"],
              },
            },
            amount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const byStatus = {};
    const successTotalsByCurrency = {};

    for (const row of summary) {
      const statusKey = row._id?.status || "pending";
      const currencyKey = normalizePaymentCurrency(row._id?.currency);

      if (!byStatus[statusKey]) {
        byStatus[statusKey] = { count: 0, totalsByCurrency: {} };
      }

      byStatus[statusKey].count += row.count;
      byStatus[statusKey].totalsByCurrency[currencyKey] = row.amount;

      if (statusKey === "success") {
        successTotalsByCurrency[currencyKey] =
          (successTotalsByCurrency[currencyKey] || 0) + row.amount;
      }
    }

    res.json({
      success: true,
      payments: payments.map(mapAdminPayment),
      summary: {
        byStatus,
        successTotalsByCurrency,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

exports.exportAdminPayments = async (req, res) => {
  try {
    const query = await buildAdminPaymentQuery(req.query);
    const payments = await Payment.find(query)
      .populate("orderId", "orderId totalAmount currency status paymentMethod")
      .populate("metadata.userId", "username email firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5000);

    const headers = [
      "Payment Reference",
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Amount",
      "Currency",
      "Status",
      "Method",
      "Created At",
    ];

    const rows = payments.map((payment) => {
      const mapped = mapAdminPayment(payment);
      return [
        mapped.paymentId,
        mapped.orderNumber || "",
        mapped.customerName || "",
        mapped.customerEmail || "",
        mapped.amount,
        mapped.currency,
        mapped.status,
        mapped.paymentMethod,
        mapped.createdAt ? new Date(mapped.createdAt).toISOString() : "",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map(toCsvCell).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="admin-payments-${new Date().toISOString().split("T")[0]}.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting admin payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export payments",
      error: error.message,
    });
  }
};

// Helper Functions
const logUserActivity = async (userId, action, details = {}, ip = "") => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.actions.push({
      action,
      timestamp: new Date(),
      details,
      ip,
    });

    await user.save();
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

// Reset seller's password
exports.resetSellerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const tempPassword = crypto.randomBytes(8).toString("hex");
    // Don't hash here - let the pre-save middleware handle it
    seller.user.password = tempPassword;
    seller.user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    seller.user.resetPasswordExpires = Date.now() + 3600000;

    await seller.user.save();

    // Send email
    await sendAdminTriggeredPasswordResetEmail({
      to: seller.user.email,
      username: seller.user.username,
      tempPassword,
      locale: seller.user.preferredLanguage,
      accountType: "seller",
    });

    // Log password reset
    await logUserActivity(seller.user._id, "password_reset", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
    });

    res.json({
      success: true,
      message: "Password reset successful. Email sent to seller.",
      tempPassword,
    });
  } catch (error) {
    console.error("Reset seller password error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// Toggle seller's 2FA status
exports.toggleSeller2FA = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.user.twoFactorEnabled = !seller.user.twoFactorEnabled;
    if (seller.user.twoFactorEnabled) {
      seller.user.twoFactorSecret = crypto.randomBytes(32).toString("hex");
    } else {
      seller.user.twoFactorSecret = null;
    }

    await seller.user.save();

    // Log 2FA toggle
    await logUserActivity(
      seller.user._id,
      seller.user.twoFactorEnabled ? "2fa_enabled" : "2fa_disabled",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `2FA ${seller.user.twoFactorEnabled ? "enabled" : "disabled"
        } successfully`,
      twoFactorEnabled: seller.user.twoFactorEnabled,
    });
  } catch (error) {
    console.error("Toggle seller 2FA error:", error);
    res
      .status(500)
      .json({ message: "Error toggling 2FA status", error: error.message });
  }
};

// Toggle seller's block status
exports.toggleSellerBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.user.isBlocked = !seller.user.isBlocked;
    if (!seller.user.isBlocked) {
      seller.user.failedLoginAttempts = 0;
      seller.user.lastFailedLogin = null;
    }

    // Force logout when blocking
    if (seller.user.isBlocked) {
      seller.user.isOnline = false;
      seller.user.sessionId = null;
    }

    await seller.user.save();

    // Log block status change
    await logUserActivity(
      seller.user._id,
      seller.user.isBlocked ? "account_blocked" : "account_unblocked",
      {
        adminId: req.adminUser._id,
        adminUsername: req.adminUser.username,
      }
    );

    res.json({
      success: true,
      message: `Seller ${seller.user.isBlocked ? "blocked" : "unblocked"
        } successfully`,
      isBlocked: seller.user.isBlocked,
    });
  } catch (error) {
    console.error("Toggle seller block status error:", error);
    res
      .status(500)
      .json({ message: "Error toggling block status", error: error.message });
  }
};

// Get seller's activity log
exports.getSellerActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const formattedActivities = (seller.user.actions || []).map((activity) => ({
      id: activity._id,
      action: activity.action,
      timestamp: activity.timestamp,
      details: activity.details,
      ip: activity.ip,
      formattedDate: new Date(activity.timestamp).toLocaleString(),
    }));

    res.json({
      success: true,
      activities: formattedActivities.sort((a, b) => b.timestamp - a.timestamp),
    });
  } catch (error) {
    console.error("Get seller activity error:", error);
    res.status(500).json({
      message: "Error fetching activity log",
      error: error.message,
    });
  }
};

// Force logout seller
exports.forceSellerLogout = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate("user");
    if (!seller || !seller.user) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.user.isOnline = false;
    seller.user.sessionId = null;
    await seller.user.save();

    // Log forced logout
    await logUserActivity(seller.user._id, "forced_logout", {
      adminId: req.adminUser._id,
      adminUsername: req.adminUser.username,
      reason: req.body.reason || "Admin action",
    });

    res.json({
      success: true,
      message: "Seller forced to logout successfully",
    });
  } catch (error) {
    console.error("Force seller logout error:", error);
    res
      .status(500)
      .json({ message: "Error forcing seller logout", error: error.message });
  }
};

exports.getAdminSellers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    let query = {};

    // Add status filter if provided
    if (req.query.verificationStatus) {
      query.verificationStatus = req.query.verificationStatus;
    }

    // Add search filter if provided
    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const matchingUserIds = matchingUsers.map((user) => user._id);

      query.$or = [
        { storeName: { $regex: search, $options: "i" } },
        ...(matchingUserIds.length ? [{ user: { $in: matchingUserIds } }] : []),
      ];
    }

    const useComputedSort = ["rating", "totalSales"].includes(sortBy);

    let sellersQuery = Seller.find(query)
      .populate(
        "user",
        "username email twoFactorEnabled isBlocked lastLogin isOnline currency countryCode"
      )
      .populate("products")
      .select(
        "storeName storeDescription verificationStatus isVerified isVacationMode totalSales averageRating products reviews createdAt updatedAt statusNote fulfillmentType selfShippingApproved selfShippingRequestStatus"
      );

    if (useComputedSort) {
      sellersQuery = sellersQuery.sort({ createdAt: -1 });
    } else {
      sellersQuery = sellersQuery
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ [sortBy]: order === "desc" ? -1 : 1 });
    }

    const sellers = await sellersQuery;

    const sellerUserIds = sellers
      .map((seller) => seller.user?._id)
      .filter(Boolean);

    const orderStats = sellerUserIds.length
      ? await Order.aggregate([
          {
            $match: {
              seller: { $in: sellerUserIds },
            },
          },
          {
            $group: {
              _id: {
                seller: "$seller",
                currency: "$currency",
              },
              totalSales: { $sum: "$totalAmount" },
              orderCount: { $sum: 1 },
              cancelledOrders: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0],
                },
              },
            },
          },
        ])
      : [];

    const statsBySellerId = new Map();
    for (const row of orderStats) {
      const sellerId = row._id?.seller?.toString();
      const currency = row._id?.currency || "NGN";
      if (!sellerId) continue;

      if (!statsBySellerId.has(sellerId)) {
        statsBySellerId.set(sellerId, {
          orderCount: 0,
          cancelledOrders: 0,
          salesTotalsByCurrency: {},
          totalSales: 0,
        });
      }

      const stats = statsBySellerId.get(sellerId);
      stats.orderCount += row.orderCount || 0;
      stats.cancelledOrders += row.cancelledOrders || 0;
      stats.totalSales += row.totalSales || 0;
      stats.salesTotalsByCurrency[currency] =
        (stats.salesTotalsByCurrency[currency] || 0) + (row.totalSales || 0);
    }

    const total = await Seller.countDocuments(query);

    const enrichedSellers = sellers.map((seller) => {
        const sellerObject = seller.toObject();
        const stats = statsBySellerId.get(seller.user?._id?.toString()) || {
          orderCount: 0,
          cancelledOrders: 0,
          salesTotalsByCurrency: {},
          totalSales: 0,
        };

        const products = Array.isArray(sellerObject.products)
          ? sellerObject.products
          : [];
        const ratedProducts = products.filter(
          (product) => Number(product?.numberOfRatings || 0) > 0
        );
        const totalPortfolioRatings = ratedProducts.reduce(
          (sum, product) => sum + Number(product.numberOfRatings || 0),
          0
        );
        const weightedPortfolioRating = totalPortfolioRatings
          ? ratedProducts.reduce(
              (sum, product) =>
                sum +
                Number(product.averageRating || 0) *
                  Number(product.numberOfRatings || 0),
              0
            ) / totalPortfolioRatings
          : 0;

        return {
          ...sellerObject,
          orderCount: stats.orderCount,
          cancelledOrders: stats.cancelledOrders,
          cancellationRate: stats.orderCount
            ? (stats.cancelledOrders / stats.orderCount) * 100
            : 0,
          salesTotalsByCurrency: stats.salesTotalsByCurrency,
          totalSales: stats.totalSales || sellerObject.totalSales || 0,
          sellerReviewAverageRating: Number(sellerObject.averageRating || 0),
          sellerReviewCount: sellerObject.reviews?.length || 0,
          portfolioAverageRating: weightedPortfolioRating,
          portfolioRatingsCount: totalPortfolioRatings,
        };
      });

    const sortDirection = order === "desc" ? -1 : 1;
    const sortedSellers = useComputedSort
      ? [...enrichedSellers].sort((a, b) => {
          const aValue =
            sortBy === "rating"
              ? a.portfolioRatingsCount > 0
                ? Number(a.portfolioAverageRating || 0)
                : Number(a.sellerReviewAverageRating || 0)
              : Number(a.totalSales || 0);
          const bValue =
            sortBy === "rating"
              ? b.portfolioRatingsCount > 0
                ? Number(b.portfolioAverageRating || 0)
                : Number(b.sellerReviewAverageRating || 0)
              : Number(b.totalSales || 0);

          if (bValue === aValue) {
            return (
              (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) *
              sortDirection
            );
          }

          return (aValue - bValue) * sortDirection;
        })
      : enrichedSellers;

    const paginatedSellers = useComputedSort
      ? sortedSellers.slice((page - 1) * limit, page * limit)
      : sortedSellers;

    res.json({
      sellers: paginatedSellers,
      pagination: {
        total,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res
      .status(500)
      .json({ message: "Error fetching sellers", error: error.message });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id)
      .populate(
        "user",
        "username email twoFactorEnabled isBlocked lastLogin isOnline currency countryCode"
      )
      .populate("products");

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const salesTotalsByCurrency = {};
    let orderCount = 0;
    let cancelledOrders = 0;
    let totalSales = 0;

    const statsRows = await Order.aggregate([
      {
        $match: {
          seller: seller.user?._id,
        },
      },
      {
        $group: {
          _id: "$currency",
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0],
            },
          },
        },
      },
    ]);

    for (const row of statsRows) {
      const currency = row._id || "NGN";
      salesTotalsByCurrency[currency] = row.totalSales || 0;
      orderCount += row.orderCount || 0;
      cancelledOrders += row.cancelledOrders || 0;
      totalSales += row.totalSales || 0;
    }

    const products = Array.isArray(seller.products) ? seller.products : [];
    const ratedProducts = products.filter(
      (product) => Number(product?.numberOfRatings || 0) > 0
    );
    const portfolioRatingsCount = ratedProducts.reduce(
      (sum, product) => sum + Number(product.numberOfRatings || 0),
      0
    );
    const portfolioAverageRating = portfolioRatingsCount
      ? ratedProducts.reduce(
          (sum, product) =>
            sum +
            Number(product.averageRating || 0) *
              Number(product.numberOfRatings || 0),
          0
        ) / portfolioRatingsCount
      : 0;
  
    const Address = require("../models/addressModels");
    const address = await Address.findOne({ user: seller.user?._id, isDispatch: true }) || 
                    await Address.findOne({ user: seller.user?._id, isDefault: true }) ||
                    await Address.findOne({ user: seller.user?._id });
    const phone = address ? address.phone : null;

    res.json({
      ...seller.toObject(),
      phone,
      orderCount,
      cancelledOrders,
      cancellationRate: orderCount ? (cancelledOrders / orderCount) * 100 : 0,
      salesTotalsByCurrency,
      totalSales,
      sellerReviewAverageRating: Number(seller.averageRating || 0),
      sellerReviewCount: seller.reviews?.length || 0,
      portfolioAverageRating,
      portfolioRatingsCount,
    });
  } catch (error) {
    console.error("Error fetching seller details:", error);
    res
      .status(500)
      .json({ message: "Error fetching seller details", error: error.message });
  }
};

exports.updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus, isVerified, note, fulfillmentType, selfShippingApproved, selfShippingRequestStatus } = req.body;

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Update the verification status and verified flag
    seller.verificationStatus = verificationStatus;
    seller.isVerified = isVerified;
    if (fulfillmentType) {
      seller.fulfillmentType = fulfillmentType;
    }
    if (note) {
      seller.statusNote = note;
    }

    // Sync self-shipping states
    if (selfShippingApproved !== undefined) {
      seller.selfShippingApproved = selfShippingApproved;
      if (selfShippingApproved) {
        seller.selfShippingRequestStatus = "approved";
      } else {
        seller.selfShippingRequestStatus = seller.selfShippingRequestStatus === "approved" ? "none" : seller.selfShippingRequestStatus;
      }
    }
    if (selfShippingRequestStatus !== undefined) {
      seller.selfShippingRequestStatus = selfShippingRequestStatus;
      if (selfShippingRequestStatus === "approved") {
        seller.selfShippingApproved = true;
      } else {
        seller.selfShippingApproved = false;
      }
    }

    await seller.save();

    // Create system notification for the seller
    await createSystemNotification({
      userId: seller.user, // user ID of the seller
      title: "Seller Status Update",
      message: `Your seller account status has been updated to ${verificationStatus}${note ? `: ${note}` : ""
        }`,
      type: "System",
      priority: "high",
      actionUrl: "/seller/dashboard", // They can check their dashboard for more details
    });

    // Return the updated seller object
    res.json({
      success: true,
      seller: await Seller.findById(id).populate("user", "username email"),
    });
  } catch (error) {
    console.error("Error updating seller status:", error);
    res
      .status(500)
      .json({ message: "Error updating seller status", error: error.message });
  }
};

exports.getSellerReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "username",
      },
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.json({ reviews: seller.reviews });
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    res
      .status(500)
      .json({ message: "Error fetching seller reviews", error: error.message });
  }
};

// Manual Payout Processing (replaces automatic cron job)
exports.processPayouts = async (req, res) => {
  try {
    const payoutService = require("../services/payoutService");
    const logger = require("../utils/logger");

    logger.info(`Manual payout processing initiated by admin: ${req.adminUser.email}`);

    // Process all pending payouts
    const results = await payoutService.processVendorPayouts();

    logger.info("Manual payout processing completed", { results });

    res.json({
      success: true,
      message: "Payout processing completed successfully",
      results: results
    });
  } catch (error) {
    console.error("Error in manual payout processing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payouts",
      error: error.message
    });
  }
};

exports.reconcileAfriExchangePayouts = async (req, res) => {
  try {
    const payoutService = require("../services/payoutService");
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);
    const results = await payoutService.reconcileAfriExchangePayouts({ limit });

    res.json({
      success: true,
      message: "AfriExchange payout reconciliation completed",
      results,
    });
  } catch (error) {
    console.error("Error reconciling AfriExchange payouts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reconcile AfriExchange payouts",
      error: error.message,
    });
  }
};

exports.checkPayoutStatus = async (req, res) => {
  try {
    const payoutService = require("../services/payoutService");
    const result = await payoutService.checkPayoutStatus(req.params.id);

    res.json({
      success: !!result.success || !!result.status,
      result,
    });
  } catch (error) {
    console.error("Error checking payout status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check payout status",
      error: error.message,
    });
  }
};

exports.simulateAfriExchangeProcessingPayout = async (req, res) => {
  try {
    if (
      process.env.NODE_ENV !== "development" &&
      process.env.NODE_ENV !== "test"
    ) {
      return res.status(403).json({
        success: false,
        message: "This helper is only available in development or test",
      });
    }

    const payoutService = require("../services/payoutService");
    const payout = await VendorPayout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found",
      });
    }

    if (!/afriexchange/i.test(payout.paymentMethod || "")) {
      return res.status(400).json({
        success: false,
        message: "This helper only supports AfriExchange payouts",
      });
    }

    if (payout.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Payout must be pending before simulation. Current status: ${payout.status}`,
      });
    }

    const vendor = await User.findById(payout.vendorId).select(
      "email afriExchange countryCode currency paymentMethod"
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found for payout",
      });
    }

    const payoutResult = await payoutService.processAfriExchangePayout(
      vendor,
      payout,
      payout.currency
    );

    if (!payoutResult.success) {
      return res.status(400).json({
        success: false,
        message:
          payoutResult.message ||
          "Failed to create AfriExchange payout for processing simulation",
      });
    }

    payout.status = "processing";
    payout.transferReference =
      payoutResult.reference || payoutResult.payoutId || payout.transferReference;
    payout.providerPayoutId = payoutResult.payoutId || payout.providerPayoutId;
    payout.providerStatus = payoutResult.status || "completed";
    payout.lastStatusCheckedAt = new Date();
    payout.errorMessage = undefined;
    payout.scheduledDate = new Date();
    payout.metadata = {
      ...(payout.metadata || {}),
      devSimulation: {
        simulatedBy: req.adminUser?.email,
        simulatedAt: new Date(),
        mode: "afriexchange_processing",
      },
    };

    await payout.save();

    if (payout.orderId) {
      await Order.findByIdAndUpdate(payout.orderId, {
        payoutStatus: "processing",
        lastPayoutId: payout._id,
      });
    }

    return res.json({
      success: true,
      message:
        "AfriExchange payout created and Kaalis payout left in processing for reconciliation testing",
      payout: {
        id: payout._id,
        status: payout.status,
        currency: payout.currency,
        amount: payout.amount,
        transferReference: payout.transferReference,
        providerPayoutId: payout.providerPayoutId,
        providerStatus: payout.providerStatus,
      },
    });
  } catch (error) {
    console.error("Error simulating AfriExchange processing payout:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to simulate AfriExchange processing payout",
      error: error.message,
    });
  }
};

exports.simulateAfriExchangeFailedPayout = async (req, res) => {
  try {
    if (
      process.env.NODE_ENV !== "development" &&
      process.env.NODE_ENV !== "test"
    ) {
      return res.status(403).json({
        success: false,
        message: "This helper is only available in development or test",
      });
    }

    const payoutService = require("../services/payoutService");
    const payout = await VendorPayout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout not found",
      });
    }

    if (!/afriexchange/i.test(payout.paymentMethod || "")) {
      return res.status(400).json({
        success: false,
        message: "This helper only supports AfriExchange payouts",
      });
    }

    if (payout.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Payout must be pending before failure simulation. Current status: ${payout.status}`,
      });
    }

    await payoutService.handleFailedPayout(
      payout,
      new Error("Simulated AfriExchange payout failure for development testing")
    );

    const updatedPayout = await VendorPayout.findById(req.params.id);

    if (updatedPayout) {
      updatedPayout.providerStatus = "failed";
      updatedPayout.lastStatusCheckedAt = new Date();
      updatedPayout.metadata = {
        ...(updatedPayout.metadata || {}),
        devSimulation: {
          simulatedBy: req.adminUser?.email,
          simulatedAt: new Date(),
          mode: "afriexchange_failed",
        },
      };
      await updatedPayout.save();
    }

    return res.json({
      success: true,
      message:
        "AfriExchange payout failure simulated. Kaalis retry/error handling has been applied.",
      payout: updatedPayout
        ? {
            id: updatedPayout._id,
            status: updatedPayout.status,
            retriesCount: updatedPayout.retriesCount,
            scheduledDate: updatedPayout.scheduledDate,
            errorMessage: updatedPayout.errorMessage,
            providerStatus: updatedPayout.providerStatus,
          }
        : null,
    });
  } catch (error) {
    console.error("Error simulating AfriExchange failed payout:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to simulate AfriExchange failed payout",
      error: error.message,
    });
  }
};

exports.getAdminPayouts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const status = req.query.status || "";
    const paymentMethod = req.query.paymentMethod || "";
    const currency = req.query.currency || "";
    const search = (req.query.search || "").trim();
    const now = new Date();

    const query = {};

    if (status === "ready") {
      query.status = "pending";
      query.scheduledDate = { $lte: now };
    } else if (status === "scheduled") {
      query.status = "pending";
      query.scheduledDate = { $gt: now };
    } else if (status) {
      query.status = status;
    }

    if (paymentMethod) {
      query.paymentMethod = { $regex: new RegExp(`^${paymentMethod}$`, "i") };
    }

    if (currency) {
      query.currency = currency;
    }

    const vendorSearchIds = [];
    if (search) {
      const [matchingVendors, matchingOrders] = await Promise.all([
        User.find({
          $or: [
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
          ],
        })
          .select("_id")
          .limit(50)
          .lean(),
        Order.find({
          orderId: { $regex: search, $options: "i" },
        })
          .select("_id")
          .limit(50)
          .lean(),
      ]);

      vendorSearchIds.push(...matchingVendors.map((vendor) => vendor._id));
      const orderSearchIds = matchingOrders.map((order) => order._id);
      query.$or = [
        { transactionReference: { $regex: search, $options: "i" } },
        { transferReference: { $regex: search, $options: "i" } },
        { vendorId: { $in: vendorSearchIds } },
        { orderId: { $in: orderSearchIds } },
      ];
    }

    const statsQuery = { ...query };
    delete statsQuery.status;
    delete statsQuery.scheduledDate;

    const [payouts, total, summary] = await Promise.all([
      VendorPayout.find(query)
        .populate("vendorId", "firstName lastName email afriExchange paymentMethod currency")
        .populate("orderId", "orderId totalAmount currency status transactionId")
        .sort({ scheduledDate: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      VendorPayout.countDocuments(query),
      VendorPayout.aggregate([
        { $match: statsQuery },
        {
          $group: {
            _id: {
              status: "$status",
              currency: "$currency",
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const summaryByStatus = summary.reduce((acc, item) => {
      const statusKey = item._id.status || "unknown";
      const currencyKey = item._id.currency || "NGN";

      if (!acc[statusKey]) {
        acc[statusKey] = {};
      }

      acc[statusKey][currencyKey] = {
        amount: item.total,
        count: item.count,
      };

      return acc;
    }, {});

    const readyCount = await VendorPayout.countDocuments({
      status: "pending",
      scheduledDate: { $lte: now },
    });

    res.json({
      success: true,
      payouts: payouts.map((payout) => ({
        id: payout._id,
        vendor: payout.vendorId,
        order: payout.orderId,
        amount: payout.amount,
        currency: payout.currency || "NGN",
        status: payout.status,
        paymentMethod: payout.paymentMethod,
        scheduledDate: payout.scheduledDate,
        processedAt: payout.processedAt,
        transactionReference: payout.transactionReference,
        transferReference: payout.transferReference,
        providerPayoutId: payout.providerPayoutId,
        providerStatus: payout.providerStatus,
        lastStatusCheckedAt: payout.lastStatusCheckedAt,
        errorMessage: payout.errorMessage,
        isReady: payout.status === "pending" && payout.scheduledDate <= now,
        createdAt: payout.createdAt,
      })),
      summary: {
        byStatus: summaryByStatus,
        readyCount,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin payouts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payouts",
      error: error.message,
    });
  }
};
