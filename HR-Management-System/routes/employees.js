import express from "express";
import mongoose from "mongoose";
import { Employee } from "../schemas.js";

const employeesRouter = express.Router();

const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);
employeesRouter.post("/add", async (req, res) => {
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
employeesRouter.put("/update", async (req, res) => {
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
employeesRouter.get("/", async (req, res) => {
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
employeesRouter.get("/emp/:id", async (req, res) => {
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
employeesRouter.delete("/delete", async (req, res) => {
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
export default employeesRouter;
