import express from "express";
import Application from "../schemas/applicationSchema.js";
import mongoose from "mongoose";
import checkRole from "../../middleware/role.js";
import { getApplications,deleteApplication,filterApplications, newApplication,updateStatus} from "../controllers/applicationController.js";

const appRouter = express.Router();

appRouter.get("/", getApplications);
appRouter.post("/",checkRole(["Admin","HR"]),newApplication);
appRouter.get("/filter", filterApplications);
appRouter.put("/status", checkRole(["Admin","HR"]),updateStatus);
appRouter.delete("/delete",checkRole(["Admin","HR"]), deleteApplication);

export default appRouter;
