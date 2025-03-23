import express from "express";
import { getReport } from "../controllers/reportController.js";


const reportRouter = express.Router();

reportRouter.get("/", getReport);

export default reportRouter;
