import mongoose from "mongoose";
import bcrypt from "bcryptjs";  
const employeeSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
    contactNumber: { type: String, required: false },
    address: {
      current: { type: String, required: false },
      permanent: { type: String },
    },
    emergencyContact: {
      name: { type: String, required: false },
      relationship: { type: String, required: false },
      phone: { type: String, required: false },
    },

    // Authentication & Role-Based Access Control (RBAC)
    role: {
      type: String,
      enum: [
        "CEO", "CTO", "CFO", "CMO", "COO", "CHRO", // Leadership
        "Manager", "Team Lead", "Employee", "Intern", // Managers & Team Members
      ],
      required: true,
      default: "Employee",
    },

    permissions: {
      strategyDefinition: { type: Boolean, default: false }, // Leadership
      decisionMaking: { type: Boolean, default: false }, // Leadership
      performanceMonitoring: { type: Boolean, default: false }, // Leadership
      taskAssignment: { type: Boolean, default: false }, // Managers
      deadlineTracking: { type: Boolean, default: false }, // Managers
      teamFeedback: { type: Boolean, default: false }, // Managers
      taskUpdates: { type: Boolean, default: false }, // Team Members
      progressSharing: { type: Boolean, default: false }, // Team Members
      collaboration: { type: Boolean, default: false }, // Team Members
    },

    // Professional Information
    jobTitle: { type: String, required: false },
    department: { type: String, required: false },
    reportingManager: { type: String, required: false },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Intern"],
      required: false,
    },
    dateOfJoining: { type: Date, required: false },
    // employeeID: { type: String, required: false, unique: false },
    workLocation: { type: String, required: false },
    dateOfExit: { type: Date },

    // Payroll (Only Leadership & HR can access)
    payrolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payroll" }],

    // Compensation and Benefits
    benefits: {
      healthInsurance: { type: String },
      providentFund: { type: String },
    },
    email: { type: String, required: true, unique: true },  // 🔹 Used for authentication
  password: { type: String, required: true },  // 🔹 Securely hashed password
    taxDetails: {
      pan: { type: String },
      tin: { type: String },
    },
    payrollBankDetails: {
      accountNumber: { type: String },
      bankName: { type: String },
      ifscCode: { type: String },
    },

    // Performance and Skills
    appraisals: [
      {
        date: { type: Date, required: false },
        review: { type: String, required: false },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    skills: [String],
    certifications: [String],
    trainingRecords: [
      {
        trainingName: { type: String },
        completionDate: { type: Date },
      },
    ],
    resetToken: { type: String },
resetTokenExpires: { type: Date },


    // Attendance and Leave
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],

    // HR Notes and Compliance
    employeeStatus: {
      type: String,
      enum: ["Active", "Inactive", "Terminated"],
      default: "Active",
    },
    disciplinaryActions: [
      {
        date: { type: Date },
        action: { type: String },
        remarks: { type: String },
      },
    ],
    contractDetails: { type: String },
    visaOrWorkPermit: { type: String },
    backgroundVerification: { type: Boolean, default: false },
    performance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Performance" }],

    // Document Management
    officialEmail: { type: String },
    documents: [
      {
        documentType: { type: String, required: false },
        filePath: { type: String, required: false },
      },
    ],
    employeePhoto: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt

);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
