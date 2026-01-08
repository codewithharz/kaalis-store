const Role = require("../models/roleModels");
const User = require("../models/userModels");

// Create a new role
const createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// assign a role to a user
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: "User or Role not found" });
    }

    user.roles.push(role._id);
    await user.save();

    res.status(200).json({ message: "Role assigned successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.roleId, req.body, {
      new: true,
    });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRole,
  assignRoleToUser,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
};
