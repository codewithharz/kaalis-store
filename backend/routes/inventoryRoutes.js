const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryByProduct,
  getAllInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

// Routes for inventory
router.post("/", userAuthMiddleware, createInventory);
router.put("/:inventoryId", userAuthMiddleware, updateInventory);
router.delete("/:inventoryId", userAuthMiddleware, deleteInventory);
router.get("/product/:productId", userAuthMiddleware, getInventoryByProduct);
router.get("/", userAuthMiddleware, getAllInventory);

module.exports = router;
