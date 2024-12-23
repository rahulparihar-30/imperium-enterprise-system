import express from "express";
import { Application } from "../schemas.js";
import mongoose from "mongoose";
const appRouter = express.Router();

const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);
const deleteRejectedApplications = async () => {
  try {
    const deleteApplications = await Application.deleteMany({
      status: "Rejected",
    });
    console.log(deleteApplications);
  } catch (error) {
    console.error("Error while deleting rejected applications", error);
  }
};
appRouter.get("/", async (req, res) => {
  try {
    const applications = await Application.find();

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found." });
    }

    res.status(200).json({
      message: "Applications fetched successfully.",
      applications,
    });
  } catch (error) {
    console.error("Error while fetching job applications:", error);
    res.status(500).json({
      message: "Error while fetching the job applications.",
      error: error.message,
    });
  }
});
appRouter.post("/", async (req, res) => {
  try {
    // Destructure fields from request body
    const {
      applicantName,
      email,
      phone,
      addressLine,
      city,
      state,
      country,
      postalCode,
      resumeUrl,
      coverLetter,
      linkedInProfile,
      portfolioUrl,
      jobId,
      status,
      appliedAt,
      notes,
    } = req.body;
    if (checkId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }
    // Validate required fields
    if (!applicantName || !email || !jobId || !resumeUrl) {
      return res.status(400).json({
        message:
          "Required fields are missing. Please provide all necessary details.",
      });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({ email, jobId });
    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
      });
    }

    // Create new application document
    const application = new Application({
      applicantName,
      email,
      phone,
      address: {
        addressLine,
        city,
        state,
        country,
        postalCode,
      },
      resumeUrl,
      coverLetter,
      linkedInProfile,
      portfolioUrl,
      jobId,
      status: status || "Pending", // Default to "Pending" if not provided
      appliedAt: appliedAt || new Date(), // Default to current date if not provided
      notes,
    });

    // Save application to the database
    await application.save();

    // Send success response
    res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    // Log the error and send error response
    console.error("Error saving application:", error);
    res.status(500).json({
      message: "Error while saving the job application.",
      error: error.message,
    });
  }
});
appRouter.get("/filter", async (req, res) => {
  try {
    const filter = {};

    // Add filters based on query parameters
    if (req.query.city) {
      filter["address.city"] = req.query.city; // Adjust to match nested address structure
    }
    if (req.query.appliedDate) {
      filter.appliedAt = { $gte: new Date(req.query.appliedDate) };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.email) {
      filter.email = req.query.email;
    }
    if (req.query.jobId) {
      filter.jobId = req.query.jobId;
    }
    if (req.query.country) {
      filter["address.country"] = req.query.country;
    }
    if (req.query.state) {
      filter["address.state"] = req.query.state;
    }
    const applicants = await Application.find(filter);

    if (!applicants || applicants.length === 0) {
      return res.status(404).json({
        message: "No applicants match the provided filters.",
      });
    }
    res.status(200).json({
      message: "Applicants fetched successfully.",
      data: applicants,
    });
  } catch (error) {
    // Handle errors and send appropriate response
    console.error("Error fetching applicants:", error);
    res.status(500).json({
      message: "Error fetching applicants.",
      error: error.message,
    });
  }
});
appRouter.put("/status", async (req, res) => {
  try {
    const { id, status, date } = req.query;

    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }

    if ((status === "Interview" || status === "Shortlisted") && !date) {
      return res.status(400).json({
        message:
          "Interview date is required for Interview or Shortlisted status.",
      });
    }
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      status === "Interview" || status === "Shortlisted"
        ? { status, interviewDate: date }
        : { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        message: "Application not found.",
        id: id,
      });
    }
    deleteRejectedApplications();
    if (status === "Rejected") {
      return res.status(200).json({
        message:
          "Application moved to trash bin. It will be deleted after 10 days by a scheduled job.",
      });
    }
    res.status(200).json({
      message: "Application status updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      message: "Error updating application status.",
      error: error.message,
    });
  }
});
appRouter.delete("/delete", async (req, res) => {
  try {
    const { id } = req.query;
    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }

    const deletApplication = await Application.deleteOne({ _id: id });
    if (!deletApplication) {
      return res.status(404).json({
        message: "Applicant not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Application with provided Id deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Deleting job",
      error: error.message,
    });
  }
});

export default appRouter;
