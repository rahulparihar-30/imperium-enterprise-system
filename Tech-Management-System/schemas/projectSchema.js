import mongoose from "mongoose";

// Project Schema
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Only CTO can create projects
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    status: { type: String, enum: ["Active", "Completed", "Archived"], default: "Active" },
  },
  { timestamps: true }
);

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Assigned to a team member
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    progressUpdates: [
      {
        update: { type: String },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    approval: {
      approved: { type: Boolean, default: false },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Only CTO can approve
      approvedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Export models
export const Project = mongoose.model("Project", projectSchema);
export const Task = mongoose.model("Task", taskSchema);
