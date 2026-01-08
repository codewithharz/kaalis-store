const Report = require("../models/reportModels");
const mongoose = require("mongoose");

// Create a new report
const createReport = async (req, res) => {
  try {
    // Validate ObjectId for referenceId
    if (!mongoose.Types.ObjectId.isValid(req.body.referenceId)) {
      return res.status(400).json({ error: "Invalid reference ID" });
    }

    // Check for rate limiting (e.g., only allow 5 reports per user per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const reportCount = await Report.countDocuments({
      user: req.user._id,
      createdAt: { $gte: oneHourAgo },
    });

    if (reportCount >= 3) {
      return res
        .status(429)
        .json({ error: "Too many reports. Please try again later." });
    }

    const report = new Report({
      user: req.user._id,
      reason: req.body.reason,
      details: req.body.details,
      type: req.body.type,
      referenceId: req.body.referenceId,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
      .populate("user")
      .populate("resolvedBy");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reports (admin only)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user").populate("resolvedBy");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update report status (admin only)
const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    report.status = req.body.status;
    report.resolvedBy = req.user._id;
    report.resolutionNotes = req.body.resolutionNotes;
    await report.save();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a report (admin only)
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    await report.deleteOne();
    res.status(200).json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getReportById,
  getAllReports,
  updateReportStatus,
  deleteReport,
};
