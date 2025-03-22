import { Router } from "express";
import clientRouter from "./routes/clientRoutes.js";
import workflowRouter from "./routes/workflowRouter.js";
import reportRouter from "./routes/reportRouter.js";
const oms = Router();
oms.use("/clients", clientRouter);
oms.use("/workflow", workflowRouter);
oms.use("/productivity", reportRouter);
export default oms;