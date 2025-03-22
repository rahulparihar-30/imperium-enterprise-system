import mongoose from "mongoose";
const productivitySchema = new mongoose.Schema({
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    tasksCompleted: { type: Number, required: true },
    hoursWorked: { type: Number, required: true },
    efficiencyScore: { type: Number, required: true },
    reportDate: { type: Date, default: Date.now }
  });
const Productivity = mongoose.model("Productivity", productivitySchema);
export default Productivity;