import { Router } from "express";
import mongoose from "mongoose";
import { Task } from "../schemas/projectSchema.js";
const taskRouter = Router();
const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

taskRouter.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const skip = (page - 1) * limit;

    const tasks = await Task.find().skip(Number(skip)).limit(Number(limit));
    const totalTasks = await Task.countDocuments();
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks Found" });
    }
    res.status(200).json({
      message: "Tasks fetched successfully.",
      metadata: {
        total: totalTasks,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalTasks / limit),
      },
      tasks,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while fetching tasks.",
        error: error.message,
      });
  }
});

taskRouter.post("/", async (req, res) => {
  try {
    const { title, description, project, assignedTo, status } = req.body;

    if (!title || !project || !assignedTo) {
      return res
        .status(400)
        .json({
          message: "Title, project, and assignedTo fields are required.",
        });
    }

    const newTask = new Task({
      title,
      description,
      project,
      assignedTo,
      status,
    });
    const savedTask = await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully.", task: savedTask });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while creating the task.",
        error: error.message,
      });
  }
});

taskRouter.get("/task", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || checkId(id)) {
      return res.status(400).json({ message: "A valid task ID is required." });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task fetched successfully.", task });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while fetching the task.",
        error: error.message,
      });
  }
});

taskRouter.put("/task", async (req, res) => {
  try {
    const { id, title, description, project, assignedTo, status } = req.body;

    if (!id || checkId(id)) {
      return res.status(400).json({ message: "A valid task ID is required." });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (project) updatedFields.project = project;
    if (assignedTo) updatedFields.assignedTo = assignedTo;
    if (status) updatedFields.status = status;

    const updatedTask = await Task.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully.", task: updatedTask });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while updating the task.",
        error: error.message,
      });
  }
});

taskRouter.delete("/task", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || checkId(id)) {
      return res.status(400).json({ message: "A valid task ID is required." });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res
      .status(200)
      .json({ message: "Task deleted successfully.", task: deletedTask });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while deleting the task.",
        error: error.message,
      });
  }
});

taskRouter.put("/task/approve", async (req, res) => {
  try {
    const {id} = req.query;
    const { approvedBy } = req.body;

    // Check if the user exists and is a CTO
    const user = await Employee.findById(approvedBy);
    if (!user || user.role !== "CTO") {
      return res.status(403).json({ message: "Only CTO can approve tasks" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        "approval.approved": true,
        "approval.approvedBy": approvedBy,
        "approval.approvedAt": new Date(),
      },
      { new: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task approved successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

taskRouter.patch("/task",async (req,res) => {
  try{
    const {update,updatedBy} = req.body;
    const id = req.body.id
    if (!id || checkId(id)) return res.status(400).json({ message: "A valid task ID is required." });
    if(!update && !updatedBy) return res.status(400).json({message:"All the fields are must."})
    const task = await Task.findById(id)
    if(!task) return res.status(404).json({message:"No Task found!"});
    const updateData = {
      update,
      updatedBy
    }
    task.progressUpdates.push(updateData);
    await task.save()
    res.status(200).json({ message: "Progress update added successfully.", task });
    }catch{
      res
      .status(500)
      .json({
        message: "An error occurred while updating the task.",
        error: error.message,
      });
    }
})
export default taskRouter;