import mongoose from "mongoose";
import Performance from "../schemas/performanceSchema.js";
import Employee from "../schemas/emplyeeSchema.js";

const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

export const getPerformance = async (req, res) => {
  const { id } = req.query;
  if (checkId(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const performance = await Performance.find({ employeeId: id });
    if (!performance) {
      return res.status(404).send("Performance not found");
    }
    res.status(200).json(performance);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const addPerformance = async (req, res) => {
  const { employeeId, comment } = req.body;

  if (!employeeId || !comment) {
    return res.status(400).send("All fields are required");
  }

  if (checkId(employeeId)) {
    return res.status(400).send("Invalid employee ID format");
  }

  try {
    const newPerformance = new Performance({
      employeeId,
      comment,
      date: new Date(),
    });

    await newPerformance.save();
    updateInEmp(employeeId, newPerformance._id);
    res.status(201).json(newPerformance);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const updateInEmp = async (employeeID, updateId) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      employeeID,
      { performance: updateId },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found with the provided ID",
      });
    }
  } catch (e) {}
};
