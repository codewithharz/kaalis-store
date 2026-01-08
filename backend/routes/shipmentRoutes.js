const express = require("express");
const {
  createShipment,
  getShipmentById,
  getShipmentsByOrder,
  getShipmentsBySeller,
  getAllShipments,
  updateShipmentStatus,
  updateShipmentTracking,
  updateReturnStatus,
  deleteShipment,
} = require("../controllers/shipmentController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const sellerAuthMiddleware = require("../middleware/sellerAuthMiddleware");
const router = express.Router();

// Admin routes
router.get("/", adminAuthMiddleware, getAllShipments);
router.delete("/:shipmentId", adminAuthMiddleware, deleteShipment);

// Seller routes
router.post("/", sellerAuthMiddleware, createShipment);
router.get("/seller", sellerAuthMiddleware, getShipmentsBySeller);
router.get("/:shipmentId", sellerAuthMiddleware, getShipmentById);
router.get("/order/:orderId", sellerAuthMiddleware, getShipmentsByOrder);
router.patch("/:shipmentId/status", sellerAuthMiddleware, updateShipmentStatus);
router.patch("/:shipmentId/tracking", sellerAuthMiddleware, updateShipmentTracking);
router.patch('/:shipmentId/return-status', sellerAuthMiddleware, updateReturnStatus);

module.exports = router;