const express = require("express");
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getAllDescendants,
  suggestNewCategory,
  getProductsByCategory,
  testConnection,
} = require("../controllers/categoryController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const router = express.Router();

// Get all categories
//categoryId has to match in controller
// router.get("/", userAuthMiddleware, getAllCategories); // GET /api/categories/

// Add the test endpoint first to avoid conflict with other routes
router.get("/test-connection", testConnection); // This should be before other routes

router.get("/", getAllCategories); // GET /api/categories/

// Get a specific category by ID
router.get("/:categoryId", userAuthMiddleware, getCategory); // GET /api/categories/:id

// Create a new category
router.post("/", userAuthMiddleware, createCategory); // POST /api/categories/

// Update an existing category
router.put("/:categoryId", userAuthMiddleware, updateCategory); // PUT /api/categories/:id

// Delete a category
router.delete("/:categoryId", userAuthMiddleware, deleteCategory); // DELETE /api/categories/:id

// Get subcategories of a specific category
router.get("/:categoryId/subcategories", userAuthMiddleware, getSubcategories); // GET /api/categories/:categoryId/subcategories

// Get all descendants of a specific category
router.get("/:categoryId/descendants", userAuthMiddleware, getAllDescendants); // GET /api/categories/:categoryId/descendants

router.post("/suggest", userAuthMiddleware, suggestNewCategory);

router.get("/slug/:categorySlug/products", getProductsByCategory);

module.exports = router;
