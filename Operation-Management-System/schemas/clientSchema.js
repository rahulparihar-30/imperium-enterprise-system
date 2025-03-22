import mongoose from "mongoose";
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  salesRep: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  contracts: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      status: { type: String, enum: ["Active", "Expired", "Terminated"], default: "Active" },
    },
  ],
  invoices: [
    {
      amount: { type: Number, required: true },
      status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
      dueDate: { type: Date, required: true },
    },
  ],
  agreementFile: { type: String },
  onboardingStatus: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Client = mongoose.model("Client", clientSchema);
export default Client;
