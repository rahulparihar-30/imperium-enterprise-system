import express from "express";
import Employee from "../../HR-Management-System/schemas/emplyeeSchema.js";
import checkRole from "../../middleware/role.js"; // Role-based access control
import { approveCampaign, deleteCampaign, getAllCampaigns, getSpecificCampaign, newCampaign, updateCampaign } from "../controllers/campaignController.js";

const campaignRouter = express.Router();

campaignRouter.post("/", checkRole(["CMO", "Admin", "Marketing Manager"]), newCampaign);

campaignRouter.get("/", getAllCampaigns);

campaignRouter.get("/campaign/:id", getSpecificCampaign);

campaignRouter.put("/campaign/:id", checkRole(["CMO", "Admin", "Marketing Manager"]), updateCampaign);

campaignRouter.delete("/campaign/:id", checkRole(["CMO", "Admin"]), deleteCampaign);

campaignRouter.put("/campaign/:id/approve", checkRole(["CMO"]), approveCampaign);

export default campaignRouter;