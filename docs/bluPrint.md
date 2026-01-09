# Kaalis E-commerce Application

## Models Documentation

Kaalis e-commerce application uses several models to manage various entities and functionalities. Below is a detailed description of each model.

1. **Product Model**
2. **User Model**
3. **Order Model**
4. **Review Model**
5. **Category Model**
6. **Cart Model**
7. **Payment Model**
8. **Shipment Model**
9. **Coupon Model**
10. **Inventory Model**
11. **Notification Model**
12. **Audit Log Model**
13. **Wishlist Model**
14. **Address Model**
15. **Admin User Model**
16. **Activity Log Model**
17. **Admin Notification Model**
18. **Role & Permission Model**
19. **Report Model**
20. **Feedback Model**
21. **interactionModels**ratingModel
21. **ratingModel**

### File Structure


```
  backend/
├── controllers/
│   ├── activityLogController.js
│   ├── favoriteController.js
│   ├── orderController.js
│   ├── roleController.js
│   ├── addressController.js
│   ├── cartController.js
│   ├── feedbackController.js
│   ├── paymentController.js
│   ├── shipmentController.js
│   ├── adminNotificationController.js
│   ├── categoryController.js
│   ├── inventoryController.js
│   ├── productController.js
│   ├── userController.js
│   ├── adminUserController.js
│   ├── couponController.js
│   ├── interactionModels.js
│   ├── ratingModel.js
├── models/
│   ├── activityLogModels.js
│   ├── adminNotificationModels.js
│   ├── adminUserModels.js
│   ├── addressModels.js
│   ├── auditLogModels.js
│   ├── cartModels.js
│   ├── categoryModels.js
│   ├── couponModels.js
│   ├── feedbackModels.js
│   ├── inventoryModels.js
│   ├── notificationModels.js
│   ├── orderModels.js
│   ├── paymentModels.js
│   ├── productModels.js
│   ├── reportModels.js
│   ├── roleModels.js
│   ├── reviewModels.js
│   ├── shipmentModels.js
│   └── wishlistModels.js
│   └── ratingModels.js
├── middleware/
│   └── authMiddleware.js
└── routes/
    ├── activityLogRoutes.js
    ├── orderRoutes.js
    ├── roleRoutes.js
    ├── addressRoutes.js
    ├── cartRoutes.js
    ├── feedbackRoutes.js
    ├── paymentRoutes.js
    ├── shipmentRoutes.js
    ├── adminNotificationRoutes.js
    ├── categoryRoutes.js
    ├── inventoryRoutes.js
    ├── productRoutes.js
    ├── userRoutes.js
    ├── adminUserRoutes.js
    ├── couponRoutes.js
    ├── reportRoutes.js
    └── wishlistRoutes.
    └── ratingRoutes.js
```

### 1. Product Model

**Manages the product details:**
Stores information about products available for sale, including attributes like name, description, price, stock levels, images, and related categories. It also tracks user-generated ratings and tags for better search and filtering.

```javascript
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // SEO-friendly URL
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }], // Array of image URLs
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  stock: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, // Percentage discount
  variants: [{
    color: { type: String },
    size: { type: String },
    stock: { type: Number }
  }],
  averageRating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  tags: [{ type: String }],
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
```

### 2. User Model

**Represents the users of the e-commerce platform:**
Represents registered users, including their credentials, profile information, addresses, and wishlists. This model manages user roles and permissions to control access to different features.


```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    profileCompleted: { type: Boolean, default: false },
    fullName: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    phone: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
    roles: [{ type: String, enum: ["User", "Seller", "Admin"], default: "User" }],
    permissions: [{ type: String }],
    lastLogin: { type: Date },
    socialAuth: {
      provider: { type: String },
      providerId: { type: String }
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
```

### 3. Order Model

**Manages order details.**
Tracks user orders, including the products purchased, order status, payment method, and shipping details. It ensures a structured process from order placement to delivery.

```javascript
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
```

### 4. Review Model

**Manages product reviews.**
Handles user reviews for products, capturing ratings and comments. This model facilitates community feedback and helps potential buyers make informed decisions.

```javascript
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
```

### 5. Category Model

**Manages product categories.**
Organizes products into categories for easier navigation and filtering. Each category can have a unique name and description, enhancing the user experience.

```javascript
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // For subcategories
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
```

### 6. Cart Model

**Manages user carts.**
Manages the shopping cart functionality, allowing users to add, remove, and modify product quantities before finalizing their purchases.

```javascript
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
```

### 7. Payment Model

**Manages payment details.**
Records payment transactions related to orders, including payment status and methods. It ensures secure processing and tracking of financial transactions.

```javascript
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Bank Transfer"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    transactionId: { type: String },
    refundAmount: { type: Number },
    refundStatus: {
      type: String,
      enum: ["Requested", "Processing", "Completed", "Failed"],
    },
    disputeStatus: {
      type: String,
      enum: ["Pending", "Resolved", "Declined"],
    },
    disputeReason: { type: String },
    paymentGatewayData: { type: mongoose.Schema.Types.Mixed }, // Additional data from payment gateway integration
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
```

### 8. Shipment Model

**Manages shipment details.**
Tracks the shipment status of orders, providing details on carriers, tracking numbers, and estimated delivery dates to keep users informed about their purchases.

```javascript
const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    shipmentStatus: {
      type: String,
      enum: ["Pending", "Shipped", "In Transit", "Delivered", "Returned"],
      default: "Pending",
    },
    carrier: { type: String },
    trackingNumber: { type: String },
    estimatedDeliveryDate: { type: Date },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    shippingCost: { type: Number },
    deliveryNotes: { type: String },
    returnStatus: {
      type: String,
      enum: ["Pending", "Initiated", "Received"],
      default: "Pending",
    },
    returnTrackingNumber: { type: String },
    returnShippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    // Integration with external shipping APIs
    shippingAPIResponse: { type: mongoose.Schema.Types.Mixed },
    // Additional fields as needed
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);
module.exports = Shipment;
```

### 9. Coupon Model

**Manages discount coupons.**
Handles discount coupons that users can apply to their orders. It tracks coupon codes, expiry dates, and usage limits to promote sales and customer engagement.

```javascript
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expiryDate: { type: Date, required: true },
    maxUsage: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    signature: { type: String, required: true }, // Add this field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Method to check if the coupon is still valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.active &&
    this.usedCount < this.maxUsage &&
    this.expiryDate > now
  );
};

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
```

### 10. Inventory Model

**Manages product inventory.**
Monitors stock levels for products in the system, ensuring accurate inventory management and timely restocking when necessary.

```javascript
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  warehouseLocation: { type: String },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
```

### 11. Notification Model

**Manages notifications for users.**
Facilitates communication with users by managing notifications about order updates, product availability, and promotions, enhancing user engagement.

```javascript
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["Order", "Product", "System"], required: true },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
```

### 12. Audit Log Model

**Tracks user activities for security.**
Records user activities for security purposes, helping to track actions taken by users and detect any potential issues or irregularities.

```javascript
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
module.exports = AuditLog;
```

### 13. Wishlist Model

**Manages user wishlists.**
Allows users to save products they are interested in for future reference, making it easier to find and purchase items later.

```javascript
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // Name or title of the wishlist
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    }, // Visibility option
    description: { type: String }, // Description of the wishlist
    priority: { type: Number, default: 1, min: 1, max: 5 }, // Priority of the wishlist
    tags: [{ type: String }], // Tags or categories for organizing items
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users with whom the wishlist is shared
    notificationsEnabled: { type: Boolean, default: false }, // Enable notifications for wishlist items
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
```

### 14. Address Model

**Manages user addresses.**
Stores user addresses for shipping and billing, enabling a streamlined checkout process with options for default addresses.

```javascript
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
```

### 15. Admin User Model

**Manages admin users.**
Manages admin users who have elevated privileges to perform system management tasks, ensuring secure access and control over the application.

```javascript
const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Admin", "SuperAdmin"], default: "Admin" },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
adminUserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);
module.exports = AdminUser;
```

### 16. Activity Log Model

**Tracks user activities.**
Tracks user activities within the application, providing insights into user engagement and helping to identify usage patterns.

```javascript
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    activity: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
```

### 17. Admin Notification Model

**Manages notifications for admin users.**
Manages notifications specifically for admin users, keeping them informed about system events, user actions, and critical updates.

```javascript
const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const AdminNotification = mongoose.model("AdminNotification", adminNotificationSchema);
module.exports = AdminNotification;
```

### 18. Role & Permission Model

**Manages user roles and permissions.**
Defines user roles and associated permissions, allowing for granular control over access to different features within the application.

```javascript
// backend/models/roleModel.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String }, // Optional description for the role
    permissions: [{ type: String }],
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
```

### 19. Report Model

**Tracks user reports.**
Tracks user-submitted reports regarding issues or concerns, enabling the platform to address problems and maintain a positive user experience.

```javascript
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
```

### 20. Feedback Model

**Manages user feedback.**
Collects user feedback on the application, helping to gather insights for future improvements and ensuring user satisfaction.

```javascript
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    feedback: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
```

### 21. Like Model

**Manages likes for products.**
Tracks user likes for products, contributing to social proof and popularity metrics, which can influence other users' purchasing decisions.

```javascript
const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: { 
      type: String, 
      enum: ["like", "dislike", "favorite"], 
      required: true 
    },
  },
  {
    timestamps: true,
  }
);

const Interaction = mongoose.model("Interaction", interactionSchema);
module.exports = Interaction;
```


### 22. Like Model

**Manages ratings for products.**

```javascript
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
```

### cURL Steps for Testing

Here are some example cURL commands to test various endpoints of your application:

Here are the updated `curl` commands with the provided product ID (`6696a1f8a15cee53a0d6d7c0`):

### 1. Add Multiple Products
```bash
curl -X POST http://localhost:5010/api/products \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ" \
-H "Content-Type: application/json" \
-d '[
  {
    "name": "Product 1",
    "slug": "product-1",
    "description": "Description of Product 1",
    "user": "66969f0aed76d3b4bf1f82e2",
    "price": 100,
    "images": ["image1.jpg"],
    "tags": ["tag1", "tag2"]
  },
  {
    "name": "Product 2",
    "slug": "product-2",
    "description": "Description of Product 2",
    "user": "66969f0aed76d3b4bf1f82e2",
    "price": 200,
    "images": ["image2.jpg"],
    "tags": ["tag3", "tag4"]
  }
]'
```

### 2. Upload a Single Product
```bash
curl -X POST http://localhost:5010/api/products/66969f0aed76d3b4bf1f82e2/products \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ" \
-H "Content-Type: application/json" \
-d '{
  "name": "New Product",
  "slug": "new-product",
  "description": "New Product Description",
  "price": 150,
  "images": ["new-image.jpg"],
  "tags": ["newtag"]
}'
```

### 3. Get All Products
```bash
curl -X GET http://localhost:5010/api/products \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ"
```

### 4. Get a Product by ID
```bash
curl -X GET http://localhost:5010/api/products/6696a1f8a15cee53a0d6d7c0 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ"
```

### 5. Update a Product
```bash
curl -X PUT http://localhost:5010/api/products/66969f0aed76d3b4bf1f82e2/products/6696a1f8a15cee53a0d6d7c0 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ" \
-H "Content-Type: application/json" \
-d '{
  "name": "Updated Product",
  "description": "Updated Description",
  "price": 120
}'
```

### 6. Delete a Product
```bash
curl -X DELETE http://localhost:5010/api/products/66969f0aed76d3b4bf1f82e2/products/6696a1f8a15cee53a0d6d7c0 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ"
```

### 7. Get User's Products
```bash
curl -X GET http://localhost:5010/api/products/66969f0aed76d3b4bf1f82e2/products \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ"
```

### 8. Get Related Products
```bash
curl -X GET "http://localhost:5010/api/products/6696a1f8a15cee53a0d6d7c0/related?page=1&limit=4" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk2YTlkZGExNWNlZTUzYTBkNmQ3ZmIiLCJpYXQiOjE3MjExNDk5MjksImV4cCI6MTcyMTE1MzUyOX0.r_B2RI1w5jQ6DD1TFOsdKgGmX3yfpkVfix2q-0IduVQ"
```


## Conclusion

The Kaalis E-commerce application uses these models to efficiently manage user interactions, product listings, order processing, and more, creating a seamless online shopping experience.
```








from navbar dropdown menu
 <!-- <DropdownMenuItem
                                                class="text-xs hover:text-[#363636] font-medium px-2 py-1">
                                                <router-link to="/login" class="text-white hover:text-[#24a3b5]">
                                                    Login/Register</router-link>
                                            </DropdownMenuItem> -->




<!-- register  -->

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <!-- Left Section: Form -->
            <div class="flex items-center justify-center py-12">
                <div class="mx-auto grid w-[350px] gap-6">
                    <div class="grid gap-2 text-center">
                        <h1 class="text-3xl font-bold">Register</h1>
                        <p class="text-balance text-muted-foreground text-gray-300">Create your account</p>
                    </div>
                    <!-- Form -->
                    <form @submit.prevent="register">
                        <div class="grid gap-4">
                            <div class="grid gap-2">
                                <label for="username"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Username</label>
                                <input type="text" id="username" v-model="username"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <div class="grid gap-2">
                                <label for="email"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Email</label>
                                <input type="email" id="email" v-model="email"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <div class="grid gap-2">
                                <label for="password"
                                    class="block text-lg font-semibold text-gray-300 mb-2 text-left">Password</label>
                                <input type="password" id="password" v-model="password"
                                    class="w-full text-gray-800 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <button type="submit"
                                class="w-full button-hover bg-gradient-to-t from-[#ff2f62] to-[#ff6f61] hover:from-[#ff6f61] hover:to-[#ff2f62] text-white font-bold py-2 px-4 rounded mt-4">Register</button>
                            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                        </div>
                    </form>
                    <div class="mt-4 text-center text-sm">
                        <!-- Already have an account? <router-link to="/login" class="underline">Login</router-link> -->
                        Already have an account? <a href="#" @click.prevent="$emit('switch-component', 'Login')"
                            class="underline">Login</a>
                    </div>
                </div>
            </div>
            <!-- Right Section: Image -->
            <div class="relative hidden lg:block overflow-hidden">
                <img src="https://wallpapercave.com/wp/wp7969113.jpg" alt="Image"
                    class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
                <div
                    class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-8">
                    <h2 class="text-5xl font-extrabold mb-4 animate-pulse">Join Us Today!</h2>
                    <p class="text-lg mb-4 animate-fade-in">Become a member and enjoy exclusive benefits.</p>
                    <p class="text-md">Already have an account? Login and explore more!</p>
                    <a href="#" @click.prevent="$emit('switch-component', 'Login')"
                        class="mt-4 inline-block button-hover bg-gradient-to-t from-[#ff2f62] to-[#ff6f61] hover:from-[#ff6f61] hover:to-[#ff2f62] text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Login</a>
                </div>
            </div>
        </div>