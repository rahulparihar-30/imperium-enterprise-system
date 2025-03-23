import express from 'express';
import mongoose from "mongoose";
import checkRole from  "../../middleware/role.js";
import {authenticate} from "../../middleware/auth.js";
import { deleteJob, getJobById, getJobs, newJob, updatedJob } from '../controllers/jobController.js';

const jobRouter = express.Router();

jobRouter.get("/", getJobs);
jobRouter.post("/new",authenticate,checkRole(["HR"]), newJob);
jobRouter.get("/job/:id", getJobById);
jobRouter.put("/edit/:id",authenticate,checkRole(["HR"]), updatedJob);
jobRouter.delete("/delete",authenticate,checkRole(["HR"]), deleteJob);
export default jobRouter;