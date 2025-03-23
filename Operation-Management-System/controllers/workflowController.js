import Workflow from "../schemas/workflowSchema.js";

export const getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const newWorkflow = async (req, res) => {
  const { name, departmentId } = req.body;
  if (!name || !departmentId) {
    return res
      .status(400)
      .json({ message: "Name and departmentId are required" });
  }

  const workflow = new Workflow({ name, departmentId });
  try {
    const newWorkflow = await workflow.save();
    res.status(201).json(newWorkflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const workflowById = (req, res) => {
  res.json(res.workflow);
};

export const updateWorkflow = async (req, res) => {
  if (req.body.name) res.workflow.name = req.body.name;
  if (req.body.departmentId) res.workflow.departmentId = req.body.departmentId;
  if (req.body.status) res.workflow.status = req.body.status;
  res.workflow.updatedAt = Date.now();

  try {
    const updatedWorkflow = await res.workflow.save();
    res.json(updatedWorkflow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWorkflow = async (req, res) => {
  try {
    await Workflow.findByIdAndUpdate(req.query.id, { status: "Deleted" });
    res.json({ message: "Workflow deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function getWorkflow(req, res, next) {
    let workflow;
    try {
      workflow = await Workflow.findById(req.query.id);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res.workflow = workflow;
    next();
  }