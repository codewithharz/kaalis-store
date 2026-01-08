const Interaction = require("../models/interactionModels");

// Create new interaction
const createInteraction = async (req, res) => {
  const { user, product, type } = req.body;

  try {
    if (type === "like" || type === "dislike") {
      // Check if there is already an existing like or dislike interaction for the user and product
      const existingInteraction = await Interaction.findOne({
        user,
        product,
        type: { $in: ["like", "dislike"] },
      });

      if (existingInteraction) {
        return res.status(400).json({
          message:
            "User already has a like or dislike interaction for this product",
        });
      }
    } else if (type === "favorite") {
      // Check if there is already an existing favorite interaction for the user and product
      const existingFavorite = await Interaction.findOne({
        user,
        product,
        type: "favorite",
      });

      if (existingFavorite) {
        // Remove the existing favorite interaction
        await existingFavorite.deleteOne();
        return res.status(200).json({
          message: "Favorite interaction removed successfully",
        });
      }
    }

    const interaction = new Interaction({ user, product, type });
    await interaction.save();
    res
      .status(201)
      .json({ message: "Interaction created successfully", interaction });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: "Interaction already exists" });
    }
    console.error("Error creating interaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete interaction
const deleteInteraction = async (req, res) => {
  const { interactionId } = req.params;

  try {
    const interaction = await Interaction.findById(interactionId);
    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" });
    }

    await interaction.deleteOne();
    res.status(200).json({ message: "Interaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting interaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get interactions for a specific user
const getInteractionsByUser = async (req, res) => {
  const { userId } = req.params; // Extract user ID from the route parameters

  try {
    const interactions = await Interaction.find({ user: userId }).populate(
      "product"
    );
    res.status(200).json({ interactions });
  } catch (error) {
    console.error("Error fetching interactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch interactions for a specific product
const getInteractionsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const interactions = await Interaction.find({
      product: productId,
    }).populate("user");
    res.status(200).json({ interactions });
  } catch (error) {
    console.error("Error fetching interactions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createInteraction,
  deleteInteraction,
  getInteractionsByUser,
  getInteractionsByProduct,
};
