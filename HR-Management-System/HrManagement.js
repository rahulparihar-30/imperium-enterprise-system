import {Router} from "express";
import appRouter from "./routes/applications.js";
import jobRouter from "./routes/jobs.js";
import employeesRouter from "./routes/employees.js";
import attendanceRouter from "./routes/attendance.js";
import scheduleRouter from "./routes/scheduling.js";

const HrManagementRouter = Router();

HrManagementRouter.get("/",(req,res)=>{
  res.json({
    message: "HR Management System is up and running",
  });
});
HrManagementRouter.use("/application", appRouter);
HrManagementRouter.use("/jobs", jobRouter);
HrManagementRouter.use("/employees", employeesRouter);
HrManagementRouter.use("/attendance", attendanceRouter);
HrManagementRouter.use("/schedule", scheduleRouter);


export default HrManagementRouter;