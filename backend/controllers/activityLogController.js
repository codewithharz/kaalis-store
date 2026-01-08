// activityLogController.js
const ActivityLog = require("../models/activityLogModels");

const addActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.insertMany(req.body);
    res.status(201).json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.params.userId });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateActivityLog = async (req, res) => {
  try {
    const log = await ActivityLog.findByIdAndUpdate(
      req.params.activityLogId,
      req.body,
      { new: true }
    );
    res.json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityLog.findById(req.params.activityLogId);
    if (!activityLog) {
      return res.status(404).json({ message: "Activity log not found" });
    }

    if (activityLog.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this activity log" });
    }

    await ActivityLog.deleteOne({ _id: req.params.activityLogId });
    res.json({ message: "Activity log deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addActivityLogs,
  getAllActivityLogs,
  getUserActivityLogs,
  updateActivityLog,
  deleteActivityLog,
};
