import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import  Employee from "../../HR-Management-System/schemas/emplyeeSchema.js";

dotenv.config();

const generateToken = (employee) => {
  return jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 Register Employee
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) return res.status(400).json({ message: "Employee already exists" });

    const newEmployee = await Employee.create({ fullName: { firstName, lastName }, email, password, role });
    res.status(201).json({ message: "Employee registered successfully", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error registering employee", error: error.message });
  }
};

// 📌 Employee Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(employee);
    res.status(200).json({ message: "Login successful", token, employee });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// 📌 Password Reset Request (Forgot Password)
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Generate Reset Token (Valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    employee.resetToken = resetToken;
    await employee.save();

    // Send email (Mock for now)
    console.log(`Reset Password Link: http://localhost:3000/reset-password?token=${resetToken}`);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error requesting password reset", error: error.message });
  }
};

// 📌 Reset Password (Using Token)
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const employee = await Employee.findOne({ resetToken: token });
    if (!employee) return res.status(400).json({ message: "Invalid or expired token" });

    employee.password = await bcrypt.hash(newPassword, 10);
    employee.resetToken = undefined; // Remove token after reset
    await employee.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

// 📌 Update Employee Profile
export const updateProfile = async (req, res) => {
  try {
    const { role } = req.user; // Get role from the logged-in user
    const updates = req.body;

    // 🔹 Find the Employee to Update
    const employee = await Employee.findById(req.params.id || req.user.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // 🔹 Define Update Permissions Based on Role
    const allowedFields = {
      Employee: [
        "fullName.firstName", "fullName.lastName", "email",
        "contactNumber", "address.current", "address.permanent",
        "emergencyContact.name", "emergencyContact.relationship", "emergencyContact.phone",
        "password", "employeePhoto", "documents"
      ],
      Manager: [
        "jobTitle", "department", "reportingManager", "employmentType",
        "employeeStatus", "backgroundVerification"
      ],
      HR: [
        "benefits.healthInsurance", "benefits.providentFund",
        "taxDetails.pan", "taxDetails.tin", "payrollBankDetails"
      ],
      Leadership: ["*"] // 🔹 Leadership can update all fields
    };

    // 🔹 Determine Allowed Fields for the User's Role
    const userAllowedFields = role === "CEO" || role === "CTO" || role === "CFO" || role === "CMO"
      ? allowedFields.Leadership
      : allowedFields[role] || [];

    // 🔹 Apply Updates Based on Permissions
    Object.keys(updates).forEach((key) => {
      if (userAllowedFields.includes("*") || userAllowedFields.includes(key)) {
        employee.set(key, updates[key]);
      }
    });

    await employee.save();
    res.status(200).json({ message: "Profile updated successfully", employee });

  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

