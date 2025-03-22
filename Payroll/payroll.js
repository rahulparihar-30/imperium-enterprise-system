import { Router } from "express";
import payrollRouter from "./routes/payrollRouter.js";
import budgetAllocationRouter from "./routes/budgetAllocationRouter.js";
const payroll = Router();
payroll.use("/",payrollRouter);
payroll.use("/budget",budgetAllocationRouter);

export default payroll;
