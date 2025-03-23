import express from "express";
import {
  addPerformance,
  getPerformance,
} from "../controllers/performanceController.js";

const performanceRouter = express.Router();

performanceRouter.get("/", getPerformance);

performanceRouter.post("/", addPerformance);

export default performanceRouter;
