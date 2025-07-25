import Client from "../schemas/clientSchema.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

export const getClients = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    contractStatus,
    salesRep,
  } = req.query;
  try {
    const searchQuery = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
            { company: new RegExp(search, "i") },
          ],
        }
      : {};

    if (contractStatus) searchQuery["contracts.status"] = contractStatus;
    if (salesRep) searchQuery.salesRep = salesRep;

    const clients = await Client.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const totalClients = await Client.countDocuments(searchQuery);

    res.status(200).json({
      message: "Clients fetched successfully.",
      clients,
      totalPages: Math.ceil(totalClients / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error while searching clients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const newClient = async (req, res) => {
  const { name, email, phone, company, salesRep, contracts } = req.body;
  const agreementFile = req.file ? req.file.path : null;

  if (!name || !email || !phone || !company || !salesRep) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const client = new Client({
      name,
      email,
      phone,
      company,
      salesRep,
      contracts,
      agreementFile,
    });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateClient = async (req, res) => {
  const { id } = req.query;
  const agreementFile = req.file ? req.file.path : undefined;

  if (checkId(id))
    return res.status(400).json({ message: "Invalid client id" });
  try {
    const updatedData = agreementFile
      ? { ...req.body, agreementFile }
      : req.body;
    const client = await Client.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClient = async (req, res) => {
  const { id } = req.query;
  if (checkId(id))
    return res.status(400).json({ message: "Invalid client id" });
  try {
    const client = await Client.findById(id)
      .populate("salesRep", "name")
      .lean();
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteClient = async (req, res) => {
    const { id } = req.query;
    if (checkId(id)) return res.status(400).json({ message: "Invalid client id" });
    try {
      const client = await Client.findByIdAndDelete(id);
      if (!client) return res.status(404).json({ message: "Client not found" });
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };