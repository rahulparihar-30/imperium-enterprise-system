import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Application, Job, Employee, Attendance } from "./schemas.js";
dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json());

const dbURI = process.env.DATABASE_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);
const deleteRejectedApplications = async () => {
  try {
    const deleteApplications = await Application.deleteMany({
      status: "Rejected",
    });
    console.log(deleteApplications);
  } catch (error) {
    console.error("Error while deleting rejected applications", error);
  }
};
app.get("/hr/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();

    if (jobs.length === 0) {
      res.status(404).json({
        message: "No jobs Found",
      });
    }
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while fetching the job postings",
      error: error.message,
    });
  }
});
app.post("/hr/jobs/new", async (req, res) => {
  try {
    const {
      jobTitle,
      jobLocation,
      jobType,
      salaryRange,
      experienceLevel,
      jobDescription,
      jobRequirements,
      requiredSkills,
      education,
      languageRequirements,
      applicationDeadline,
      jobPostingDate,
    } = req.body;

    // Create a new job posting document
    const newJob = new Job({
      jobTitle,
      jobLocation,
      jobType,
      salaryRange,
      experienceLevel,
      jobDescription,
      jobRequirements,
      requiredSkills,
      education,
      languageRequirements,
      applicationDeadline,
      jobPostingDate,
    });

    // Save the job posting to the database
    await newJob.save();

    // Send a success response
    res.status(200).json({
      message: "Job posted successfully",
      jobData: newJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error while posting the job",
      error: error.message,
    });
  }
});
app.get("/hr/jobs/:id", async (req, res) => {
  const { id } = req.params;
  if (checkId(id)) {
    return res.status(400).json({
      message: "Invalid job ID format",
      id: id,
    });
  }
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Job fetched successfully",
      job: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching job",
      error: error.message,
    });
  }
});
app.put("/hr/jobs/edit", async (req, res) => {
  const { id } = req.query;
  const updatedData = req.body;

  if (checkId(id)) {
    return res.status(400).json({
      message: "Invalid job ID format",
      id: id,
    });
  }
  try {
    const updatedJob = await Job.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedJob) {
      return res.status(404).json({
        message: "Job not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating job",
      error: error.message,
    });
  }
});
app.delete("/hr/jobs/delete", async (req, res) => {
  const { id } = req.query;
  try {
    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }
    const deleteJob = await Job.deleteOne({ _id: id });
    if (!deleteJob) {
      return res.status(404).json({
        message: "Job not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Job Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Deleting job",
      error: error.message,
    });
  }
});

app.get("/hr/applications", async (req, res) => {
  try {
    const applications = await Application.find();

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found." });
    }

    res.status(200).json({
      message: "Applications fetched successfully.",
      applications,
    });
  } catch (error) {
    console.error("Error while fetching job applications:", error);
    res.status(500).json({
      message: "Error while fetching the job applications.",
      error: error.message,
    });
  }
});
app.post("/hr/apply", async (req, res) => {
  try {
    // Destructure fields from request body
    const {
      applicantName,
      email,
      phone,
      addressLine,
      city,
      state,
      country,
      postalCode,
      resumeUrl,
      coverLetter,
      linkedInProfile,
      portfolioUrl,
      jobId,
      status,
      appliedAt,
      notes,
    } = req.body;
    if (checkId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }
    // Validate required fields
    if (!applicantName || !email || !jobId || !resumeUrl) {
      return res.status(400).json({
        message:
          "Required fields are missing. Please provide all necessary details.",
      });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({ email, jobId });
    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
      });
    }

    // Create new application document
    const application = new Application({
      applicantName,
      email,
      phone,
      address: {
        addressLine,
        city,
        state,
        country,
        postalCode,
      },
      resumeUrl,
      coverLetter,
      linkedInProfile,
      portfolioUrl,
      jobId,
      status: status || "Pending", // Default to "Pending" if not provided
      appliedAt: appliedAt || new Date(), // Default to current date if not provided
      notes,
    });

    // Save application to the database
    await application.save();

    // Send success response
    res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    // Log the error and send error response
    console.error("Error saving application:", error);
    res.status(500).json({
      message: "Error while saving the job application.",
      error: error.message,
    });
  }
});
app.get("/hr/filter-applicant", async (req, res) => {
  try {
    const filter = {};

    // Add filters based on query parameters
    if (req.query.city) {
      filter["address.city"] = req.query.city; // Adjust to match nested address structure
    }
    if (req.query.appliedDate) {
      filter.appliedAt = { $gte: new Date(req.query.appliedDate) };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.email) {
      filter.email = req.query.email;
    }
    if (req.query.jobId) {
      filter.jobId = req.query.jobId;
    }
    if (req.query.country) {
      filter["address.country"] = req.query.country;
    }
    if (req.query.state) {
      filter["address.state"] = req.query.state;
    }
    const applicants = await Application.find(filter);

    if (!applicants || applicants.length === 0) {
      return res.status(404).json({
        message: "No applicants match the provided filters.",
      });
    }
    res.status(200).json({
      message: "Applicants fetched successfully.",
      data: applicants,
    });
  } catch (error) {
    // Handle errors and send appropriate response
    console.error("Error fetching applicants:", error);
    res.status(500).json({
      message: "Error fetching applicants.",
      error: error.message,
    });
  }
});
app.put("/hr/application/status", async (req, res) => {
  try {
    const { id, status, date } = req.query;

    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }

    if ((status === "Interview" || status === "Shortlisted") && !date) {
      return res.status(400).json({
        message:
          "Interview date is required for Interview or Shortlisted status.",
      });
    }
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      status === "Interview" || status === "Shortlisted"
        ? { status, interviewDate: date }
        : { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        message: "Application not found.",
        id: id,
      });
    }
    deleteRejectedApplications();
    if (status === "Rejected") {
      return res.status(200).json({
        message:
          "Application moved to trash bin. It will be deleted after 10 days by a scheduled job.",
      });
    }
    res.status(200).json({
      message: "Application status updated successfully.",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      message: "Error updating application status.",
      error: error.message,
    });
  }
});
app.delete("/hr/application/delete", async (req, res) => {
  try {
    const { id } = req.query;
    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid job ID format",
        id: id,
      });
    }

    const deletApplication = await Application.deleteOne({ _id: id });
    if (!deletApplication) {
      return res.status(404).json({
        message: "Applicant not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Application with provided Id deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Deleting job",
      error: error.message,
    });
  }
});

app.post("/hr/employee/add", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      contactNumber,
      personalEmail,
      currentAddress,
      permanentAddress,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      jobTitle,
      department,
      reportingManager,
      employmentType,
      dateOfJoining,
      employeeID,
      workLocation,
      dateOfExit,
      baseSalary,
      bonuses,
      allowances,
      deductions,
      healthInsurance,
      providentFund,
      pan,
      tin,
      accountNumber,
      bankName,
      ifscCode,
      appraisals,
      skills,
      certifications,
      trainingRecords,
      employeeStatus,
      disciplinaryActions,
      contractDetails,
      visaOrWorkPermit,
      backgroundVerification,
      officialEmail,
      documents,
      employeePhoto,
    } = req.body;

    const newEmployee = new Employee({
      fullName: {
        firstName,
        lastName,
      },
      dateOfBirth,
      gender,
      contactNumber,
      personalEmail,
      address: {
        current: currentAddress,
        permanent: permanentAddress,
      },
      emergencyContact: {
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        phone: emergencyContactPhone,
      },
      jobTitle,
      department,
      reportingManager,
      employmentType,
      dateOfJoining,
      employeeID,
      workLocation,
      dateOfExit,
      salaryDetails: {
        baseSalary,
        bonuses,
        allowances,
        deductions,
      },
      benefits: {
        healthInsurance,
        providentFund,
      },
      taxDetails: {
        pan,
        tin,
      },
      payrollBankDetails: {
        accountNumber,
        bankName,
        ifscCode,
      },
      appraisals,
      skills,
      certifications,
      trainingRecords,
      employeeStatus,
      disciplinaryActions,
      contractDetails,
      visaOrWorkPermit,
      backgroundVerification,
      officialEmail,
      documents,
      employeePhoto,
    });

    await newEmployee.save();
    res.status(201).json({
      message: "Employee added successfully.",
      data: newEmployee,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({
      message: "Error adding employee.",
      error: error.message,
    });
  }
});
app.put("/hr/employee/update", async (req, res) => {
  const { id } = req.query;
  const updatedData = req.body;
  console.log(updatedData);
  if (checkId(id)) {
    return res.status(400).json({
      message: "Invalid employee ID format",
      id: id,
    });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found with the provided ID",
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      message: "Error updating employee",
      error: error.message,
    });
  }
});
app.get("/hr/employees", async (req, res) => {
  try {
    const employees = await Employee.find();

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found." });
    }

    res.status(200).json({
      message: "Employees fetched successfully.",
      employees,
    });
  } catch (error) {
    console.error("Error while fetching employees:", error);
    res.status(500).json({
      message: "Error while fetching the employees.",
      error: error.message,
    });
  }
});

app.get("/hr/employee/:id", async (req, res) => {
  const { id } = req.params;
  if (checkId(id)) {
    return res.status(400).json({
      message: "Invalid employee ID format",
      id: id,
    });
  }
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching employee",
      error: error.message,
    });
  }
});

app.delete("/hr/employee/delete", async (req, res) => { 
  const { id } = req.query;
  try {
    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID format",
        id: id,
      });
    }
    const deleteEmployee = await Employee.deleteOne({ _id: id });
    if (!deleteEmployee) {
      return res.status(404).json({
        message: "Employee not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Employee Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error Deleting employee",
      error: error.message,
    });
  }
});

app.post("/hr/attendance/mark", async (req, res) => {
  try {
    const { employeeId, date, workHours, shift, status } = req.body;

    if (checkId(employeeId)) {
      return res.status(400).json({
        message: "Invalid employee ID format",
        id: employeeId,
      });
    }

    const newAttendance = new Attendance({
      employeeId,
      date,
      workHours,
      shift,
      status,
    });

    await newAttendance.save();
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found with the provided ID",
      });
    }
    employee.attendance.push(newAttendance._id);
    await employee.save();
    res.status(201).json({
      message: "Attendance marked successfully.",
      data: newAttendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({
      message: "Error marking attendance.",
      error: error.message,
    });
  }
});

app.get("/hr/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find();

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    if (attendance.length === 0) {
      return res.status(404).json({
        message: "No attendance records match the provided filters.",
      });
    } else {
      res.status(200).json({
        message: "Attendance records fetched successfully.",
        data: attendance,
      });
    }
  } catch (error) {
    console.error("Error while fetching attendance records:", error);
    res.status(500).json({
      message: "Error while fetching the attendance records.",
      error: error.message,
    });
  }
});

app.get("/hr/attendance/:id", async (req, res) => {
  const { id } = req.params;
  if (checkId(id)) {
    return res.status(400).json({
      message: "Invalid attendance ID format",
      id: id,
    });
  }
  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Attendance record fetched successfully",
      data: attendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching attendance record",
      error: error.message,
    });
  }
});

app.put("/hr/attendance/update", async (req, res) => {
  const { date } = req.query;
  const updatedData = req.body;

  if (!date) {
    return res.status(400).json({
      message: "Date is required to update attendance record",
    });
  }

  try {
    const updatedAttendance = await Attendance.findOneAndUpdate({ date: new Date(date) }, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAttendance) {
      return res.status(404).json({
        message: "Attendance record not found for the provided date",
      });
    }

    res.status(200).json({
      message: "Attendance record updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating attendance record:", error);
    res.status(500).json({
      message: "Error updating attendance record",
      error: error.message,
    });
  }
});

app.get("/hr/attendance-filter", async (req, res) => {
  try {
    const filter = {};

    if (req.query.employeeId) {
      if (checkId(req.query.employeeId)) {
        return res.status(400).json({
          message: "Invalid employee ID format",
          id: req.query.employeeId,
        });
      }
      filter.employeeId = req.query.employeeId;
    }
    if (req.query.date) {
      filter.date = new Date(req.query.date);
    }
    if (req.query.shift) {
      filter.shift = req.query.shift;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.id) {
      if (checkId(req.query.id)) {
        return res.status(400).json({
          message: "Invalid attendance ID format",
          id: req.query.id,
        });
      }
      filter._id = req.query.id;
    }
    const attendance = await Attendance.find(filter);
    if (!attendance || attendance.length === 0) {
      return res.status(404).json({
        message: "No attendance records match the provided filters.",
      });
    }

    res.status(200).json({
      message: "Attendance records fetched successfully.",
      data: attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({
      message: "Error fetching attendance records.",
      error: error.message,
    });
  }
});

app.delete("/hr/attendance/delete", async (req, res) => {
  const { id } = req.query;
  try {
    if (checkId(id)) {
      return res.status(400).json({
        message: "Invalid attendance ID format",
        id: id,
      });
    }
    const deleteAttendance = await Attendance.deleteOne({ _id: id });
    if (!deleteAttendance) {
      return res.status(404).json({
        message: "Attendance record not found with the provided ID",
      });
    }
    res.status(200).json({
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting attendance record",
      error: error.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(
    "HR Management Microservice Started Successfully and listening on port " +
      PORT
  );
});
