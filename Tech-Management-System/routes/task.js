import express from "express";
import { Task } from "../schemas/projectSchema.js";
import checkRole from "../../middleware/role.js";
const taskRouter = express.Router();
const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

// 🔹 Get All Tasks
taskRouter.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
      message: "Tasks fetched successfully.",
      metadata: { total: totalTasks, page: Number(page), limit: Number(limit) },
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// 🔹 Create a Task (Only CTO & Managers)
taskRouter.post("/", checkRole(["CTO", "Manager"]), async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, deadline } = req.body;
    if (!title || !project || !assignedTo) {
      return res.status(400).json({ message: "Title, project, and assignedTo fields are required." });
    }
    const newTask = new Task({ title, description, project, assignedTo, priority, deadline });
    await newTask.save();
    res.status(201).json({ message: "Task created successfully.", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

// 🔹 Update Task (Only Managers & CTO)
taskRouter.put("/task/:id", checkRole(["CTO", "Manager"]), async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
});

// 🔹 Archive Task Instead of Deleting
taskRouter.delete("/task/:id", checkRole(["CTO"]), async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { status: "Archived" });
    res.json({ message: "Task archived successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error archiving task", error: error.message });
  }
});

// 🔹 Approve Task (Only CTO)
taskRouter.put("/task/:id/approve", checkRole(["CTO"]), async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
      "approval.approved": true,
      "approval.approvedBy": approvedBy,
      "approval.approvedAt": new Date(),
    }, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task approved successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error approving task", error: error.message });
  }
});

export default taskRouter;
