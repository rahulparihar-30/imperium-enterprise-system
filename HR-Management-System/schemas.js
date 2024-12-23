import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobLocation: { type: String, required: true },
  jobType: { type: String, required: true },
  salaryRange: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobRequirements: [String],
  requiredSkills: [String],
  education: { type: String, required: true },
  languageRequirements: { type: String, required: true },
  applicationDeadline: { type: Date, required: true },
  jobPostingDate: { type: Date, required: true },
});


const applicationSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, "Invalid phone number"],
  },
  address: {
    addressLine: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
  },
  resumeUrl: {
    type: String,
    required: true,
    trim: true,
    match: [/^(http|https):\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  linkedInProfile: {
    type: String,
    trim: true,
    match: [/^(http|https):\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
  },
  portfolioUrl: {
    type: String,
    trim: true,
    match: [/^(http|https):\/\/[^\s$.?#].[^\s]*$/, "Invalid URL"],
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Shortlisted", "Interview", "Rejected", "Hired"],
    default: "Pending",
  },
  interviewDate: {
    type: Date,
    default: null,
  }
  ,
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
});
const employeeSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contactNumber: { type: String, required: true },
    personalEmail: { type: String, required: true, unique: true },
    address: {
      current: { type: String, required: true },
      permanent: { type: String },
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // Professional Information
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    reportingManager: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Intern"],
      required: true,
    },
    dateOfJoining: { type: Date, required: true },
    employeeID: { type: String, required: true, unique: true },
    workLocation: { type: String, required: true },
    dateOfExit: { type: Date },

    // Compensation and Benefits
    salaryDetails: {
      baseSalary: { type: Number, required: true },
      bonuses: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },
    benefits: {
      healthInsurance: { type: String },
      providentFund: { type: String },
    },
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
        date: { type: Date, required: true },
        review: { type: String, required: true },
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

    // Attendance and Leave
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance"}],
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

    // Document Management
    officialEmail: { type: String },
    documents: [
      {
        documentType: { type: String, required: true },
        filePath: { type: String, required: true },
      },
    ],
    employeePhoto: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

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

export const Application = mongoose.model("Applications", applicationSchema);
export const Job = mongoose.model("Job", jobSchema);
export const Employee = mongoose.model('Employee', employeeSchema);
export const Attendance = mongoose.model('Attendance', attendanceSchema);