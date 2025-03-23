import { Router } from "express";
import checkRole from "../../middleware/role.js"; // Role-based access control middleware
import multer from "multer";
import path from "path";
import { deleteClient, getClient, getClients, newClient, updateClient } from "../controllers/clientContoller.js";

const clientRouter = Router();

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
clientRouter.get("/", getClients);

clientRouter.post("/", checkRole(["Admin", "Sales"]), upload.single("agreementFile"), newClient);

clientRouter.put("/client", checkRole(["Admin", "Sales"]), upload.single("agreementFile"), updateClient);
clientRouter.get("/client", getClient);
clientRouter.delete("/client", checkRole(["Admin", "Sales"]),deleteClient);

export default clientRouter;