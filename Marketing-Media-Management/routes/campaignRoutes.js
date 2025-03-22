import express from "express";
import { Campaign } from "../schemas/campaignModel.js";
import Employee from "../../HR-Management-System/schemas/emplyeeSchema.js";
import checkRole from "../../middleware/role.js"; // Role-based access control

const campaignRouter = express.Router();

// 🔹 Create a Campaign (Only CMO, Admin, or Marketing Manager)
campaignRouter.post("/", checkRole(["CMO", "Admin", "Marketing Manager"]), async (req, res) => {
  try {
    const { name, description, assignedTo, metrics } = req.body;
    const newCampaign = new Campaign({ name, description, assignedTo, metrics });
    const savedCampaign = await newCampaign.save();
    res.status(201).json({ message: "Campaign created successfully", campaign: savedCampaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get All Campaigns (With Pagination & Filtering)
campaignRouter.get("/", async (req, res) => {
  const { page = 1, limit = 10, status, assignedTo, approved } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (approved !== undefined) filter["approval.approved"] = approved;
  
  try {
    const campaigns = await Campaign.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("assignedTo");

    const totalCampaigns = await Campaign.countDocuments(filter);
    res.status(200).json({
      message: "Campaigns fetched successfully.",
      metadata: { total: totalCampaigns, page: Number(page), limit: Number(limit) },
      campaigns,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get a Single Campaign
campaignRouter.get("/campaign/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("assignedTo");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Update a Campaign
campaignRouter.put("/campaign/:id", checkRole(["CMO", "Admin", "Marketing Manager"]), async (req, res) => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCampaign) return res.status(404).json({ message: "Campaign not found" });
    res.json({ message: "Campaign updated successfully", campaign: updatedCampaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Soft Delete a Campaign
campaignRouter.delete("/campaign/:id", checkRole(["CMO", "Admin"]), async (req, res) => {
  try {
    await Campaign.findByIdAndUpdate(req.params.id, { status: "Deleted" });
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Approve a Campaign (Only CMO)
campaignRouter.put("/campaign/:id/approve", checkRole(["CMO"]), async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, {
      "approval.approved": true,
      "approval.approvedBy": approvedBy,
      "approval.approvedAt": new Date(),
    }, { new: true });

    if (!updatedCampaign) return res.status(404).json({ message: "Campaign not found" });
    res.json({ message: "Campaign approved successfully", campaign: updatedCampaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default campaignRouter;