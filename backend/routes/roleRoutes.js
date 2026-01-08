const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  createRole,
  assignRoleToUser,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

const router = express.Router();

// Create a new role (admin only)
router.post("/", adminAuthMiddleware, createRole);

// Assign role to user
router.post("/assign", adminAuthMiddleware, assignRoleToUser);

// Get role by ID (admin only)
router.get("/:roleId", adminAuthMiddleware, getRoleById);

// Get all roles (admin only)
router.get("/", adminAuthMiddleware, getAllRoles);

// Update a role (admin only)
router.patch("/:roleId", adminAuthMiddleware, updateRole);

// Delete a role (admin only)
router.delete("/:roleId", adminAuthMiddleware, deleteRole);

module.exports = router;
