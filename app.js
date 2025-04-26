import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import HrManagementRouter from "./HR-Management-System/HrManagement.js"
import TechManagementRouter from "./Tech-Management-System/TechManagementSystem.js";
import campaignRouter from "./Marketing-Media-Management/routes/campaignRoutes.js";
import clientRouter from "./Operation-Management-System/routes/clientRoutes.js";
import payroll from "./Payroll/payroll.js";
import checkRole from "./middleware/role.js";
import oms from "./Operation-Management-System/oms.js";
import authRouter from "./Authentication/routes/authRouter.js";
import { authenticate } from "./middleware/auth.js";


dotenv.config();
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const dbURI = process.env.DATABASE_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB Atlas successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.json({
    message: "Imperium Enterprise System is up and running",
  });
});
app.use("/auth", authRouter);
app.use("/hr",HrManagementRouter);
app.use("/tech",authenticate,checkRole(["HR"]),TechManagementRouter);
app.use("/marketing",campaignRouter);
app.use("/payroll",authenticate,checkRole(["HR"]),payroll)
app.use("/operation-management",authenticate,checkRole(["HR"]),oms)
app.listen(PORT, () => {
  console.log(
    "Imperium Enterprise System Started Successfully and listening on port " +
      PORT
  );
});
