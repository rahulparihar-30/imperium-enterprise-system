import express from "express";

import checkRole from "../../middleware/role.js";
import {
  deleteEmployee,
  getAllEmployees,
  getSpecificEmployee,
  newEmployee,
  updateEmployee,
} from "../controllers/employeeController.js";

const employeesRouter = express.Router();

// ✅ ADD EMPLOYEE (HR ONLY)
employeesRouter.post("/add", checkRole(["HR"]), newEmployee);

// ✅ UPDATE EMPLOYEE (HR & MANAGERS)
employeesRouter.put("/update", checkRole(["HR", "Manager"]), updateEmployee);

// ✅ GET ALL EMPLOYEES (HR, MANAGER, LEADERSHIP)
employeesRouter.get(
  "/",
  checkRole(["HR", "Manager", "CEO", "CTO", "CFO"]),
  getAllEmployees
);

// ✅ GET SINGLE EMPLOYEE (HR, MANAGER, LEADERSHIP)
employeesRouter.get(
  "/emp/:id",
  checkRole(["HR", "Manager", "CEO", "CTO", "CFO"]),
  getSpecificEmployee
);

// ✅ DELETE EMPLOYEE (HR ONLY)
employeesRouter.delete("/delete", checkRole(["HR"]), deleteEmployee);

export default employeesRouter;
