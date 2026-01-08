const Rating = require("../models/reviewRatingModels");
const Product = require("../models/productModels"); // Import the Product model

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Rating.find().populate("user").populate("product");
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create or update rating
const createOrUpdateRating = async (req, res) => {
  const { user, product, rating, comment } = req.body;

  try {
    // Check if there is already an existing rating for the user and product
    let existingRating = await Rating.findOne({ user, product });

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      await existingRating.save();
    } else {
      // Create a new rating
      const newRating = new Rating({ user, product, rating, comment });
      await newRating.save();
    }

    // Update product's average rating and number of ratings
    const ratings = await Rating.find({ product });
    const numberOfRatings = ratings.length;
    const averageRating = (
      ratings.reduce((acc, rating) => acc + rating.rating, 0) / numberOfRatings
    ).toFixed(2);

    await Product.findByIdAndUpdate(product, {
      averageRating,
      numberOfRatings,
    });

    res.status(201).json({ message: "Rating created or updated successfully" });
  } catch (error) {
    console.error("Error creating or updating rating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get ratings by product
const getRatingsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const ratings = await Rating.find({ product: productId }).populate("user");
    res.status(200).json({ ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get ratings by user
const getRatingsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const ratings = await Rating.find({ user: userId }).populate("product");
    res.status(200).json({ ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete rating
const deleteRating = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    const product = rating.product;
    await rating.deleteOne();

    // Update product's average rating and number of ratings
    const ratings = await Rating.find({ product });
    const numberOfRatings = ratings.length;
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating.rating, 0) /
          numberOfRatings
        : 0;

    await Product.findByIdAndUpdate(product, {
      averageRating,
      numberOfRatings,
    });

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllReviews,
  createOrUpdateRating,
  getRatingsByProduct,
  getRatingsByUser,
  deleteRating,
};
