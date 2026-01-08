const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  createWishlist,
  getWishlistById,
  updateWishlist,
  deleteWishlist,
  getUserWishlists,
  shareWishlist,
  toggleWishlistNotifications,
  addCategory,
  removeCategory,
  addProductToWishlist,
  removeProductFromWishlist,
  getPublicWishlists,
  getProductsInWishlist
} = require("../controllers/wishlistController");

const router = express.Router();

router.post("/", userAuthMiddleware, createWishlist);
router.get("/:wishlistId", userAuthMiddleware, getWishlistById);
router.put("/:wishlistId", userAuthMiddleware, updateWishlist);
router.delete("/:wishlistId", userAuthMiddleware, deleteWishlist);
router.get("/user/:userId", userAuthMiddleware, getUserWishlists);
router.post("/:wishlistId/share", userAuthMiddleware, shareWishlist);
router.patch("/:wishlistId/notifications", userAuthMiddleware, toggleWishlistNotifications);
router.post("/:wishlistId/categories", userAuthMiddleware, addCategory);
router.delete("/:wishlistId/categories/:categoryId", userAuthMiddleware, removeCategory);
router.post("/:wishlistId/products", userAuthMiddleware, addProductToWishlist);
router.delete("/:wishlistId/products/:productId", userAuthMiddleware, removeProductFromWishlist);
router.get("/public", getPublicWishlists);
router.get("/:wishlistId/products", userAuthMiddleware, getProductsInWishlist);


module.exports = router;