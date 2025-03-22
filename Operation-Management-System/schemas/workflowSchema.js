import mongoose from "mongoose";
const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed", "Deleted"], default: "Pending" },
  tasksCompleted: { type: Number, default: 0 }, // Track completed tasks
  totalTasks: { type: Number, default: 0 }, // Total assigned tasks
  averageCompletionTime: { type: Number, default: 0 }, // Store average completion time in hours
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Workflow = mongoose.model("Workflow", workflowSchema);
export default Workflow;
