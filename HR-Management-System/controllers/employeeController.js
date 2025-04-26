import mongoose from "mongoose";
import Employee from "../schemas/emplyeeSchema.js";

const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

export const newEmployee = async (req, res) => {
  try {
    const {
      fullName: { firstName, lastName },
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
      salaryDetails,
      benefits,
      taxDetails,
      payrollBankDetails,
      appraisals,
      skills,
      certifications,
      trainingRecords,
      employeeStatus,
      disciplinaryActions,
      contractDetails,
      visaOrWorkPermit,
      backgroundVerification,
      email,
      documents,
      employeePhoto,
      role,
      password,
      payrollRecords, // Payroll IDs
      performanceRecords, // Performance Tracking IDs
    } = req.body;
    const newEmployee = new Employee({
      fullName: { firstName, lastName },
      dateOfBirth,
      gender,
      contactNumber,
      personalEmail,
      address: { current: currentAddress, permanent: permanentAddress },
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
      salaryDetails,
      benefits,
      taxDetails,
      payrollBankDetails,
      appraisals,
      skills,
      certifications,
      trainingRecords,
      employeeStatus,
      disciplinaryActions,
      contractDetails,
      visaOrWorkPermit,
      backgroundVerification,
      email,
      documents,
      employeePhoto,
      role,
      payrollRecords,
      performanceRecords,
      password
    });

    await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee added successfully.", data: newEmployee });
  } catch (error) {
    console.error("Error adding employee:", error);
    res
      .status(500)
      .json({ message: "Error adding employee.", error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.query;
  const updatedData = req.body;
  if (checkId(id)) {
    return res.status(400).json({ message: "Invalid employee ID format", id });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
};

export const getAllEmployees = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const employees = await Employee.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalEmployees = await Employee.countDocuments();
    if (!employees.length)
      return res.status(404).json({ message: "No employees found." });

    res.status(200).json({
      message: "Employees fetched successfully.",
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error while fetching employees:", error);
    res
      .status(500)
      .json({ message: "Error fetching employees.", error: error.message });
  }
};

export const getSpecificEmployee = async (req, res) => {
  const { id } = req.params;
  if (checkId(id))
    return res.status(400).json({ message: "Invalid employee ID format", id });

  try {
    const employee = await Employee.findById(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res
      .status(200)
      .json({ message: "Employee fetched successfully", employee });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.query;
  if (checkId(id))
    return res.status(400).json({ message: "Invalid employee ID format", id });

  try {
    const deleteEmployee = await Employee.findByIdAndDelete(id);
    if (!deleteEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};
