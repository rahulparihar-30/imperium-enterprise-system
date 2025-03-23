import { Router } from "express";
import {
  allocateBudget,
  deleteBudget,
  getBalance,
  searchBudget,
  updatedBudget,
} from "../controllers/budgetAllocationController.js";

const budgetAllocationRouter = Router();

// Add Budget Transaction
budgetAllocationRouter.post("/", allocateBudget);

// Search transactions with filters
budgetAllocationRouter.get("/", searchBudget);

// Get Total Balance
budgetAllocationRouter.get("/balance", getBalance);

// Edit (Update) a Transaction
budgetAllocationRouter.put("/:id", updatedBudget);

// Delete a transaction
budgetAllocationRouter.delete("/:id", deleteBudget);

export default budgetAllocationRouter;
