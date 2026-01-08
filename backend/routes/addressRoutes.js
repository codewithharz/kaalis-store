// addressRoutes.js
const express = require("express");
const {
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
  getUserAddresses,
} = require("../controllers/addressController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const router = express.Router();

//userId, addressId has to match in controller
router.post("/", userAuthMiddleware, addAddress); // Add address
router.get("/", userAuthMiddleware, getAllAddresses); // Get all addresses
router.put("/:userId/:addressId", userAuthMiddleware, updateAddress); // Update address
router.get("/:userId", userAuthMiddleware, getUserAddresses); // Get user's addresses
router.delete("/:addressId", userAuthMiddleware, deleteAddress);

module.exports = router;
