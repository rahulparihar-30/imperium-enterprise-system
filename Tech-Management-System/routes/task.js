import express from "express";
import checkRole from "../../middleware/role.js";
import {
  getAllTasks,
  createTask,
  updateTask,
  archiveTask,
  approveTask
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", getAllTasks);
taskRouter.post("/", checkRole(["CTO", "Manager"]), createTask);
taskRouter.put("/task/:id", checkRole(["CTO", "Manager"]), updateTask);
taskRouter.delete("/task/:id", checkRole(["CTO"]), archiveTask);
taskRouter.put("/task/:id/approve", checkRole(["CTO"]), approveTask);

export default taskRouter;
