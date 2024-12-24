import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobLocation: { type: String, required: true },
  jobType: { type: String, required: true },
  salaryRange: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobRequirements: [String],
  requiredSkills: [String],
  education: { type: String, required: true },
  languageRequirements: { type: String, required: true },
  applicationDeadline: { type: Date, required: true },
  jobPostingDate: { type: Date, required: true },
});

const Job = mongoose.model("Job", jobSchema);
export default  Job;