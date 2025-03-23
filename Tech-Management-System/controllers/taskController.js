import { Task } from "../schemas/projectSchema.js";

// Get All Tasks
export const getAllTasks = async (req, res) => {
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
};

// Create a Task
export const createTask = async (req, res) => {
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
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Archive Task (Soft Delete)
export const archiveTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { status: "Archived" });
    res.json({ message: "Task archived successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error archiving task", error: error.message });
  }
};

// Approve Task
export const approveTask = async (req, res) => {
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
};
