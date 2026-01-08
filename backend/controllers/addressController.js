// addressController.js
const Address = require("../models/addressModels");

const addAddress = async (req, res) => {
  try {
    // Ensure req.user._id is available
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID is missing." });
    }

    // Validate req.body here if necessary

    // Create new address with user ID from request
    const address = new Address({ ...req.body, user: req.user._id });
    await address.save();

    // Respond with the newly created address
    res.status(201).json(address);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error adding address:", error);

    // Respond with a detailed error message
    res
      .status(400)
      .json({ message: error.message || "Failed to add address." });
  }
};

const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(
      req.params.addressId,
      req.body,
      { new: true }
    );
    res.json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    console.log("Address User:", address.user.toString());
    console.log("Request User ID:", req.user.id);

    if (address.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this address" });
    }

    await Address.deleteOne({ _id: req.params.addressId });
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
  getUserAddresses,
};
