import { Router } from "express";
import Client from "../schemas/clientSchema.js";
import mongoose from "mongoose";
import checkRole from "../../middleware/role.js"; // Role-based access control middleware
import multer from "multer";
import path from "path";

const clientRouter = Router();
const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/contracts/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

clientRouter.get("/", async (req, res) => {
  const { page = 1, limit = 10, search = "", contractStatus, salesRep } = req.query;
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
});

clientRouter.post("/", checkRole(["Admin", "Sales"]), upload.single("agreementFile"), async (req, res) => {
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
    const client = new Client({ name, email, phone, company, salesRep, contracts, agreementFile });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

clientRouter.put("/client/:id", checkRole(["Admin", "Sales"]), upload.single("agreementFile"), async (req, res) => {
  const { id } = req.params;
  const agreementFile = req.file ? req.file.path : undefined;
  
  if (checkId(id)) return res.status(400).json({ message: "Invalid client id" });
  try {
    const updatedData = agreementFile ? { ...req.body, agreementFile } : req.body;
    const client = await Client.findByIdAndUpdate(id, updatedData, { new: true });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default clientRouter;