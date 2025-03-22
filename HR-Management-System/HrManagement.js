import {Router} from "express";
import appRouter from "./routes/applications.js";
import jobRouter from "./routes/jobs.js";
import employeesRouter from "./routes/employees.js";
import attendanceRouter from "./routes/attendance.js";
import scheduleRouter from "./routes/scheduling.js";
import performanceRouter from "./routes/performance.js";
import {authenticate} from "../middleware/auth.js";
import checkRole from "../middleware/role.js";
const HrManagementRouter = Router();

HrManagementRouter.get("/",(req,res)=>{
  res.json({
    message: "HR Management System is up and running",
  });
});
HrManagementRouter.use("/application", appRouter);
HrManagementRouter.use("/jobs", jobRouter);
HrManagementRouter.use("/employees",authenticate,checkRole(["HR"]), employeesRouter);
HrManagementRouter.use("/attendance", authenticate,checkRole(["HR"]),attendanceRouter);
HrManagementRouter.use("/schedule",authenticate,checkRole(["HR"]), scheduleRouter);
HrManagementRouter.use("/performance",authenticate,checkRole(["HR"]),performanceRouter);


export default HrManagementRouter;