import { Router } from "express";
import mongoose from "mongoose";
import Budget from "../schemas/budgetSchema.js";

const budgetAllocationRouter = Router();

// Add Budget Transaction
budgetAllocationRouter.post("/", async (req, res) => {
  try {
    const { transactionId, date, amount, type, remarks } = req.body;

    if (!transactionId || !date || !amount || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const budget = new Budget({ transactionId, date, amount, type, remarks });
    await budget.save();

    res.status(201).json({ message: "Budget allocation processed", budget });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Search transactions with filters
budgetAllocationRouter.get("/", async (req, res) => {
  try {
    const { transactionId, date, amount, type, remarks } = req.query;

    const query = {};
    if (transactionId) query.transactionId = transactionId;
    if (date) query.date = date;
    if (amount) query.amount = amount;
    if (type) query.type = type;
    if (remarks) query.remarks = { $regex: new RegExp(remarks, "i") };

    const budgets = await Budget.find(query);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get Total Balance
budgetAllocationRouter.get("/balance", async (req, res) => {
  try {
    const transactions = await Budget.find();
    let totalBalance = 0;

    transactions.forEach((transaction) => {
      if (transaction.type.toLowerCase() === "credit") {
        totalBalance += transaction.amount;
      } else if (transaction.type.toLowerCase() === "debit") {
        totalBalance -= transaction.amount;
      }
    });

    res.json({ totalBalance });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Edit (Update) a Transaction
budgetAllocationRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, date, amount, type, remarks } = req.body;

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { transactionId, date, amount, type, remarks },
      { new: true, runValidators: true } // Return updated document & validate changes
    );

    if (!updatedBudget) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction updated successfully", updatedBudget });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Delete a transaction
budgetAllocationRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Budget allocation deleted", deletedBudget });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

export default budgetAllocationRouter;
