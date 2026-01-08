const Inventory = require("../models/inventoryModels");

// Create new inventory
const createInventory = async (req, res) => {
  const { product, quantity, warehouseLocation } = req.body;

  try {
    const newInventory = new Inventory({
      product,
      quantity,
      warehouseLocation,
    });
    await newInventory.save();
    res
      .status(201)
      .json({
        message: "Inventory created successfully",
        inventory: newInventory,
      });
  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update inventory
const updateInventory = async (req, res) => {
  const { inventoryId } = req.params;
  const { quantity, warehouseLocation } = req.body;

  try {
    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    inventory.quantity = quantity !== undefined ? quantity : inventory.quantity;
    inventory.warehouseLocation =
      warehouseLocation || inventory.warehouseLocation;

    await inventory.save();
    res
      .status(200)
      .json({ message: "Inventory updated successfully", inventory });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete inventory
const deleteInventory = async (req, res) => {
  const { inventoryId } = req.params;

  try {
    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    await inventory.deleteOne();
    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get inventory for a specific product
const getInventoryByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const inventory = await Inventory.find({ product: productId }).populate(
      "product"
    );
    res.status(200).json({ inventory });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all inventory
const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("product");
    res.status(200).json({ inventory });
  } catch (error) {
    console.error("Error fetching all inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryByProduct,
  getAllInventory,
};
