import mongoose from "mongoose";

const PayrollSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true, min: 0 },
  deductions: { type: Number, default: 0, min: 0 },
  allowances: { type: Number, default: 0, min: 0 },
  bonuses: { type: Number, default: 0, min: 0 },
  netSalary: { type: Number, min: 0 },
  paymentDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },

  benefits: {
    healthInsurance: { type: Boolean, default: false },
    providentFund: { type: Boolean, default: false },
  },

  // taxDetails: {
  //   pan: { type: String, required: true, unique: true },
  //   tin: { type: Number, required: true, unique: true },
  // },

  payrollBankDetails: {
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    ifscCode: { type: String, required: true },
  },
}, { timestamps: true });

// Middleware to auto-calculate net salary before saving
PayrollSchema.pre("save", function (next) {
  this.netSalary = this.salary + this.allowances + this.bonuses - this.deductions;
  next();
});

const Payroll = mongoose.model("Payroll", PayrollSchema);
export default Payroll;
