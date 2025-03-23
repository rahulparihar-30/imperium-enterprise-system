 import { Project} from "../schemas/projectSchema.js";
 import mongoose from "mongoose";
const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

export const getProject = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const skip = (page - 1) * limit;
  
      const projects = await Project.find()
        .skip(Number(skip))
        .limit(Number(limit)).populate("createdBy");
      const totalProjects = await Project.countDocuments();
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No Projects Found" });
      }
      res.status(200).json({
        message: "Projects fetched successfully.",
        metadata: {
          total: totalProjects,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalProjects / limit),
        },
        projects,
      });
    } catch (error) {
      console.error("Error while fetching job applications:", error);
      res.status(500).json({
        message: "Error while fetching the job applications.",
        error: error.message,
      });
    }
  };

  export const newProject = async (req, res) => {
    const { title, description, createdBy } = req.body;
    try {
      if (!title || !description || !createdBy) {
        return res.status(400).json({
          message:
            "Required fields are missing. Please provide all necessary details.",
        });
      }
      if (checkId(createdBy)) {
        return res
          .sendStatus(400)
          .json({ Error: "Invalid Employee Id", id: createdBy });
      }
      const project = new Project({ title, description, createdBy });
      await project.save();
      res.status(201).json({
        message: "Project submitted successfully.",
        project,
      });
    } catch (error) {
      console.error("Error saving project:", error);
      res.status(500).json({
        message: "Error while saving the project.",
        error: error.message,
      });
    }
  };

  export const getProjectById = async (req, res) => {
    const { id } = req.query;
    try {
      if (checkId(id)) {
        return res.sendStatus(400).json({ Error: "Invalid Project Id", id: id });
      }
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(200).json({
        message: "Project fetched successfully.",
        project,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        message: "Error while fetching the project.",
        error: error.message,
      });
    }
  };

  export const updateProject = async (req, res) => {
    const { id } = req.query;
    const updateData = req.body;
    try {
        if (checkId(id)) {
            return res.status(400).json({ Error: "Invalid Project Id", id: id });
        }
        const project = await Project.findByIdAndUpdate(id, updateData, { new: true });
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }
        res.status(200).json({
            message: "Project updated successfully.",
            project,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            message: "Error while updating the project.",
            error: error.message,
        });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.query;
    try {
        if (checkId(id)) {
            return res.status(400).json({ Error: "Invalid Project Id", id: id });
        }
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            message: "Project deleted successfully.",
            project,
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({
            message: "Error while deleting the project.",
            error: error.message,
        });
    }
}