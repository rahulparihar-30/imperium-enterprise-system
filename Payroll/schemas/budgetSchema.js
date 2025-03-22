import mongoose from "mongoose";
const BudgetSchema = new mongoose.Schema({
  transactionId: String,
  date: Date,
  amount: Number,
  type: { type: String, enum: ["credit", "debit"],required: true },
  remarks: String,
});
const Budget = mongoose.model("Budget", BudgetSchema);
export default Budget;