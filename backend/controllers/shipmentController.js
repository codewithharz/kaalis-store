const Shipment = require("../models/shipmentModels");
const Order = require("../models/orderModels");

// Create a new shipment
const createShipment = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId, ...shipmentData } = req.body;

    // Verify that the order belongs to the seller
    const order = await Order.findOne({ _id: orderId, seller: sellerId });
    if (!order) {
      return res.status(403).json({
        error: "You are not authorized to create a shipment for this order",
      });
    }

    const shipment = new Shipment({
      ...shipmentData,
      order: orderId,
      seller: sellerId,
    });

    const savedShipment = await shipment.save();
    res.status(201).json(savedShipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get shipment by ID
const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Check if the user is an admin or the seller of this shipment
    if (
      req.user.role !== "admin" &&
      shipment.seller.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this shipment" });
    }

    res.json(shipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get shipments by order ID
const getShipmentsByOrder = async (req, res) => {
  try {
    const shipments = await Shipment.find({ order: req.params.orderId });

    // If user is not an admin, filter shipments to only those belonging to the seller
    if (req.user.role !== "admin") {
      shipments = shipments.filter(
        (shipment) => shipment.seller.toString() === req.user._id.toString()
      );
    }

    res.json(shipments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all shipments (admin only)
const getAllShipments = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to view all shipments" });
    }

    const shipments = await Shipment.find();
    res.json(shipments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get shipments by seller
const getShipmentsBySeller = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const shipments = await Shipment.find({ seller: sellerId }).populate(
      "order"
    );
    res.json(shipments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update shipment status
const updateShipmentStatus = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Check if the user is an admin or the seller of this shipment
    if (
      req.user.role !== "admin" &&
      shipment.seller.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this shipment" });
    }

    shipment.shipmentStatus = req.body.shipmentStatus;
    const updatedShipment = await shipment.save();
    res.json(updatedShipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update shipment tracking information
const updateShipmentTracking = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Check if the user is an admin or the seller of this shipment
    if (
      req.user.role !== "admin" &&
      shipment.seller.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this shipment" });
    }

    shipment.carrier = req.body.carrier;
    shipment.trackingNumber = req.body.trackingNumber;
    const updatedShipment = await shipment.save();
    res.json(updatedShipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update shipment return status
const updateReturnStatus = async (req, res) => {
  const { returnStatus } = req.body;
  const { shipmentId } = req.params;
  try {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // Check if the user is an admin or the seller of this shipment
    if (
      req.user.role !== "admin" &&
      shipment.seller.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this shipment" });
    }

    shipment.returnStatus = returnStatus;
    const updatedShipment = await shipment.save();
    res.json(updatedShipment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a shipment (admin only)
const deleteShipment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete shipments" });
    }

    const shipment = await Shipment.findByIdAndDelete(req.params.shipmentId);
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }
    res.json({ message: "Shipment deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createShipment,
  getShipmentById,
  getShipmentsByOrder,
  getAllShipments,
  getShipmentsBySeller,
  updateShipmentStatus,
  updateShipmentTracking,
  updateReturnStatus,
  deleteShipment,
};
