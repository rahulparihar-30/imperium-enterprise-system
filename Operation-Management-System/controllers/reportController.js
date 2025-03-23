 import Workflow from "../schemas/workflowSchema.js";

 export const getReport = async (req, res) => {
    try {
      // Aggregate completed vs total tasks
      const workflows = await Workflow.find().lean();
      
      let totalCompletedTasks = 0;
      let totalAssignedTasks = 0;
      let totalCompletionTime = 0;
      let totalCompletedWorkflows = 0;
  
      workflows.forEach((workflow) => {
        totalCompletedTasks += workflow.tasksCompleted;
        totalAssignedTasks += workflow.totalTasks;
        if (workflow.status === "Completed") {
          totalCompletionTime += workflow.averageCompletionTime;
          totalCompletedWorkflows++;
        }
      });
   
      const taskCompletionRate = totalAssignedTasks > 0
        ? ((totalCompletedTasks / totalAssignedTasks) * 100).toFixed(2)
        : 0;
  
      const avgWorkflowCompletionTime = totalCompletedWorkflows > 0
        ? (totalCompletionTime / totalCompletedWorkflows).toFixed(2)
        : 0;
  
      res.status(200).json({
        message: "Productivity Report",
        taskCompletionRate: `${taskCompletionRate}%`,
        averageWorkflowCompletionTime: `${avgWorkflowCompletionTime} hours`,
        totalCompletedTasks,
        totalAssignedTasks
      });
    } catch (error) {
      res.status(500).json({ message: "Error generating productivity report", error: error.message });
    }
  };