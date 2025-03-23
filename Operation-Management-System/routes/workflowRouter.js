import { Router } from "express";
import Workflow from "../schemas/workflowSchema.js";
import {
  getWorkflows,
  getWorkflow,
  newWorkflow,
  workflowById,
  updateWorkflow,
  deleteWorkflow,
} from "../controllers/workflowController.js";

const workflowRouter = Router();

// Get all workflows
workflowRouter.get("/", getWorkflows);

// Create a new workflow
workflowRouter.post("/", newWorkflow);

// Get a workflow by ID
workflowRouter.get("/", getWorkflow, workflowById);

// Update a workflow
workflowRouter.put("/", getWorkflow, updateWorkflow);

// Delete (soft delete) a workflow
workflowRouter.delete("/", getWorkflow, deleteWorkflow);

export default workflowRouter;
