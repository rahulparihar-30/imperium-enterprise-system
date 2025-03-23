import express from "express";
import { deleteSchedule, getSchdules, getScheduleById, newSchedule, updatedSchedule } from "../controllers/schedulerController.js";


const scheduleRouter = express.Router();
// GET all schedules with pagination
scheduleRouter.get("/",getSchdules);

// CREATE a new schedule
scheduleRouter.post("/create", newSchedule);

// GET a single schedule by ID
scheduleRouter.get("/:id", updatedSchedule);

// UPDATE a schedule by ID
scheduleRouter.put("/:id", getScheduleById);

// DELETE a schedule by ID
scheduleRouter.delete("/:id", deleteSchedule);

export default scheduleRouter;
