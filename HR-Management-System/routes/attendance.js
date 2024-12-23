import express from "express";
import mongoose from "mongoose";
import { Attendance } from "../schemas.js";

const attendanceRouter = express.Router();
const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

attendanceRouter.post("/mark", async (req, res) => {
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

attendanceRouter.get("/", async (req, res) => {
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

attendanceRouter.get("/attendance/:id", async (req, res) => {
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

attendanceRouter.put("/update", async (req, res) => {
  const { date } = req.query;
  const updatedData = req.body;

  if (!date) {
    return res.status(400).json({
      message: "Date is required to update attendance record",
    });
  }

  try {
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { date: new Date(date) },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

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

attendanceRouter.get("filter", async (req, res) => {
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

attendanceRouter.delete("/delete", async (req, res) => {
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

export default attendanceRouter;
