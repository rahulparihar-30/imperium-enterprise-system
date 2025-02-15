import express from "express";
import { Campaign } from "../schemas/campaignModel.js"; // Assuming you have an Employee model
import Employee from "../../HR-Management-System/schemas/emplyeeSchema.js";
const campaignRouter = express.Router();

// 🔹 Create a Campaign
campaignRouter.post("/", async (req, res) => {
  try {
    const { name, description, assignedTo } = req.body;

    const newCampaign = new Campaign({ name, description, assignedTo });
    const savedCampaign = await newCampaign.save();

    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get All Campaigns
campaignRouter.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const skip = (page - 1) * limit;
  try {
    const campaigns = await Campaign.find()
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("assignedTo");
    const totalCampaigns = await Campaign.countDocuments();
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json({
      message: "Campaigns fetched successfully.",
      metadata: {
        total: totalCampaigns,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCampaigns / limit),
      },
      campaigns,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get a Campaign by ID
campaignRouter.get("/campaign", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.query.id).populate(
      "assignedTo"
    );

    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Update a Campaign
campaignRouter.put("/campaign", async (req, res) => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.query.id,
      req.body,
      { new: true }
    );

    if (!updatedCampaign)
      return res.status(404).json({ message: "Campaign not found" });

    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Delete a Campaign
campaignRouter.delete("/campaign", async (req, res) => {
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.query.id);

    if (!deletedCampaign)
      return res.status(404).json({ message: "Campaign not found" });

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Add Performance Report
campaignRouter.put("/campaign/report", async (req, res) => {
  try {
    const { report, reportedBy } = req.body;

    const campaign = await Campaign.findById(req.query.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    campaign.performanceReports.push({ report, reportedBy });
    await campaign.save();

    res.json({ message: "Report added", campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Add Media Tracking Feedback
campaignRouter.put("/campaign/media-feedback", async (req, res) => {
  try {
    const { mediaName, progress, feedback } = req.body;

    const campaign = await Campaign.findById(req.query.id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const mediaItem = campaign.mediaTracking.find(
      (m) => m.mediaName === mediaName
    );
    if (mediaItem) {
      mediaItem.progress = progress;
      mediaItem.feedback = feedback;
    } else {
      campaign.mediaTracking.push({ mediaName, progress, feedback });
    }

    await campaign.save();
    res.json({ message: "Media feedback updated", campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

campaignRouter.put("/campaign/media-feedback/update",async (req,res) => {
  try{
    const {campaignId,mediaId} = req.query;
    const update = req.body;
    const campaign = await Campaign.findById(campaignId);
    if(!campaign) return res.status(404).json({message:"Campaign not found with given id"})
    const mediaItem = campaign.mediaTracking.id(mediaId);
  if(!mediaItem) return res.status(404).json({message:"Campaign not found with given media id."})
    Object.assign(mediaItem, update);
    await campaign.save();
    res.json({ message: "Media progress updated", campaign });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

// 🔹 Approve Campaign (Only CMO)
campaignRouter.put("/campaign/approve", async (req, res) => {
  try {
    const { approvedBy } = req.body;

    // Check if the user is a CMO
    const user = await Employee.findById(approvedBy);
    if (!user || user.role !== "CMO") {
      return res
        .status(403)
        .json({ message: "Only CMO can approve campaigns" });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.query.id,
      {
        "approval.approved": true,
        "approval.approvedBy": approvedBy,
        "approval.approvedAt": new Date(),
      },
      { new: true }
    );

    if (!updatedCampaign)
      return res.status(404).json({ message: "Campaign not found" });

    res.json({
      message: "Campaign approved successfully",
      campaign: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default campaignRouter;
