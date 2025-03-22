import express from 'express';
import Job from '../schemas/jobSchema.js';
import mongoose from "mongoose";
import checkRole from  "../../middleware/role.js";
import {authenticate} from "../../middleware/auth.js";
const jobRouter = express.Router();
const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

jobRouter.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const jobs = await Job.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments();

    if (jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found",
      });
    }

    res.status(200).json({
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: parseInt(page),
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while fetching the job postings",
      error: error.message,
    });
  }
});

jobRouter.post("/new",authenticate,checkRole(["HR"]), async (req, res) => {
  try {
    const {
      jobTitle,
      jobLocation,
      jobType,
      salaryRange,
      experienceLevel,
      jobDescription,
      jobRequirements,
      requiredSkills,
      education,
      languageRequirements,
      applicationDeadline,
      jobPostingDate,
    } = req.body;

    // Create a new job posting document
    const newJob = new Job({
      jobTitle,
      jobLocation,
      jobType,
      salaryRange,
      experienceLevel,
      jobDescription,
      jobRequirements,
      requiredSkills,
      education,
      languageRequirements,
      applicationDeadline,
      jobPostingDate,
    });

    // Save the job posting to the database
    await newJob.save();

    // Send a success response
    res.status(200).json({
      message: "Job posted successfully",
      jobData: newJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while posting the job",
      error: error.message,
    });
  }
});
jobRouter.get("/job/:id", async (req, res) => {
  const { id } = req.params;
  if (checkId(id)) {
    return res.status(400).json({
      message: "Invalid job ID format",
      id: id,
    });
  }
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Job fetched successfully",
      job: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching job",
      error: error.message,
    });
  }
});
jobRouter.put("/edit/:id",authenticate,checkRole(["HR"]), async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (checkId(id)) {
    return res.status(400).json({
      message: "Invalid job ID format",
      id: id,
    });
  }
  try {
    const updatedJob = await Job.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Job updated successfully",
      data: updatedJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating job",
      error: error.message,
    });
  }
});
jobRouter.delete("/delete",authenticate,checkRole(["HR"]), async (req, res) => {
  const { id } = req.query;
  try {
    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }
    const deleteJob = await Job.deleteOne({ _id: id });
    if (!deleteJob) {
      return res.status(404).json({
        message: "Job not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Job Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Deleting job",
      error: error.message,
    });
  }
});
export default jobRouter;