import { Router } from "express";
import { allPayrolls, deletePayroll, getPayroll, markAsPaid, newPayroll, totalExpesnes, updatePayroll } from "../controllers/payrollContoller.js";

const payrollRouter = Router();

//Get Total Payroll Expenses (Sum of All Net Salaries)
payrollRouter.get("/total-expenses", totalExpesnes);

//Add Payroll Entry

payrollRouter.post("/", newPayroll);

// Get All Payroll Entries
payrollRouter.get("/", allPayrolls);

// Get Payroll by Employee ID
payrollRouter.get("/:employeeId", getPayroll);

// Update Payroll Record
payrollRouter.put("/:id", updatePayroll);

//Delete Payroll Record
payrollRouter.delete("/:id", deletePayroll);

// Mark Payroll as Paid
payrollRouter.put("/:id/pay", markAsPaid);

export default payrollRouter;
