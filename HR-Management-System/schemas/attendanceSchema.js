import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "On Leave"],
    default: "Absent",
  },
  checkIn: { type: Date },
  checkOut: { type: Date },
  totalHours: { type: Number },
  remarks: { type: String }, // Reason for absence or late check-in
});
const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
