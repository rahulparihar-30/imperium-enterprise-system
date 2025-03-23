import { Router } from "express";
import { deleteProject, getProject, getProjectById, newProject, updateProject } from "../controllers/projectController.js";

const projectRouter = Router();

projectRouter.get("/",getProject );

projectRouter.post("/",newProject );

projectRouter.get("/project",getProjectById );

projectRouter.put("/project",updateProject );

projectRouter.delete("/project",deleteProject );

export default projectRouter;