import { Campaign } from "../schemas/campaignModel.js";

export const newCampaign = async (req, res) => {
  try {
    const { name, description, assignedTo, metrics } = req.body;
    const newCampaign = new Campaign({
      name,
      description,
      assignedTo,
      metrics,
    });
    const savedCampaign = await newCampaign.save();
    res
      .status(201)
      .json({
        message: "Campaign created successfully",
        campaign: savedCampaign,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCampaigns = async (req, res) => {
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
      metadata: {
        total: totalCampaigns,
        page: Number(page),
        limit: Number(limit),
      },
      campaigns,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpecificCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "assignedTo"
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCampaign)
      return res.status(404).json({ message: "Campaign not found" });
    res.json({
      message: "Campaign updated successfully",
      campaign: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveCampaign = async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
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
};
export const deleteCampaign = async (req, res) => {
  try {
    await Campaign.findByIdAndUpdate(req.params.id, { status: "Deleted" });
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
