import express from "express";
import { deleteAttendance, filterAttendance, getAllAttendance, getAttendanceById, markAttendance, updateAttendance } from "../controllers/attendanceController.js";


const attendanceRouter = express.Router();

attendanceRouter.post("/mark",markAttendance);

attendanceRouter.get("/",getAllAttendance);

attendanceRouter.get("/attendance",getAttendanceById);

attendanceRouter.put("/update",updateAttendance);

attendanceRouter.get("/filter", filterAttendance);

attendanceRouter.delete("/delete", deleteAttendance);

export default attendanceRouter;
