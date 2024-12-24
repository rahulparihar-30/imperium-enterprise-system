import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, "Invalid phone number"],
  },
  address: {
    addressLine: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
  },
  resumeUrl: {
    type: String,
    required: true,
    trim: true,
    match: [/^(http|https):\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  linkedInProfile: {
    type: String,
    trim: true,
    match: [/^(http|https):\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
  },
  portfolioUrl: {
    type: String,
    trim: true,
    match: [/^(http|https):\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Shortlisted", "Interview", "Rejected", "Hired"],
    default: "Pending",
  },
  interviewDate: {
    type: Date,
    default: null,
  }
  ,
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
});
const Application = mongoose.model("Applications", applicationSchema);
export default  Application;