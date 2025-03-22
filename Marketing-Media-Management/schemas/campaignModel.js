import mongoose from "mongoose";
const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  status: { type: String, enum: ["Planned", "Running", "Completed", "Deleted"], default: "Planned" },
  performanceReports: [{
    report: { type: String },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    reportedAt: { type: Date, default: Date.now },
  }],
  mediaTracking: [{
    mediaName: { type: String },
    progress: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
    feedback: { type: String },
  }],
  metrics: { // Track campaign success
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    ROI: { type: Number, default: 0 },
  },
  approval: {
    approved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    approvedAt: { type: Date },
  },
}, { timestamps: true });

export const Campaign = mongoose.model("Campaign", campaignSchema);