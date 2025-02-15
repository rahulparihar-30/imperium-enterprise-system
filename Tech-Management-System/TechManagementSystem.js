import { Router } from "express";
import projectRouter from "./routes/projects.js";
import taskRouter from "./routes/task.js";

const TechManagementRouter = Router();
TechManagementRouter.use("/projects",projectRouter);
TechManagementRouter.use("/tasks",taskRouter);

export default TechManagementRouter;