const Feedback = require("../models/feedbackModels");

// Create new feedback
const createFeedback = async (req, res) => {
  const { feedback } = req.body;
  const user = req.user._id;

  try {
    const newFeedback = new Feedback({ user, feedback });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback created successfully", feedback: newFeedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  const { feedbackId } = req.params;

  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.deleteOne();
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get feedback for a specific user
const getFeedbackByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const feedback = await Feedback.find({ user: userId });
    res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("user", "username");
    res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createFeedback,
  deleteFeedback,
  getFeedbackByUser,
  getAllFeedback,
};
