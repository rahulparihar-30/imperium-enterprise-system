import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import HrManagementRouter from "./HR-Management-System/HrManagement.js"
import TechManagementRouter from "./Tech-Management-System/TechManagementSystem.js";
import campaignRouter from "./Marketing-Media-Management/routes/campaignRoutes.js";

dotenv.config();
const app = express();
const PORT = 3000;
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

app.use("/hr",HrManagementRouter);
app.use("/tech",TechManagementRouter);
app.use("/marketing",campaignRouter);

app.listen(PORT, () => {
  console.log(
    "Imperium Enterprise System Started Successfully and listening on port " +
      PORT
  );
});
