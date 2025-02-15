import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Who is managing this campaign?
    status: { type: String, enum: ["Planned", "Running", "Completed"], default: "Planned" },
    performanceReports: [
      {
        report: { type: String },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        reportedAt: { type: Date, default: Date.now },
      },
    ],
    mediaTracking: [
      {
        mediaName: { type: String },
        progress: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
        feedback: { type: String },
      },
    ],
    approval: {
      approved: { type: Boolean, default: false },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Only CMO can approve
      approvedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);
