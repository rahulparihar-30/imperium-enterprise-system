import mongoose from "mongoose";
import Schedule from "../schemas/scheduledSchema.js";
import Applicant from "../schemas/applicationSchema.js";
import Employee from "../schemas/emplyeeSchema.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getSchdules = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const schedules = await Schedule.find().skip(skip).limit(Number(limit));

    const total = await Schedule.countDocuments();

    res
      .status(200)
      .json({ total, page: Number(page), limit: Number(limit), schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const newSchedule = async (req, res) => {
  try {
    const {
      date,
      applicantId,
      meetingLink,
      interviewerId,
      time,
      status,
      notes,
    } = req.body;

    if (!date || !applicantId || !meetingLink || !interviewerId || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate referenced applicantId and interviewerId
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const interviewer = await Employee.findById(interviewerId);
    if (!interviewer) {
      return res.status(404).json({ error: "Interviewer not found" });
    }

    const newSchedule = new Schedule({
      interviewDate: date,
      applicantId,
      meetingLink,
      interviewer: interviewerId,
      interviewTime: time,
      status,
      notes,
    });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getScheduleById = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatedSchedule = async (req, res) => {
  const { id } = req.params;
  const allowedUpdates = [
    "interviewDate",
    "meetingLink",
    "interviewer",
    "interviewTime",
    "status",
    "notes",
  ];

  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).json({ error: "Invalid fields in update" });
  }

  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
