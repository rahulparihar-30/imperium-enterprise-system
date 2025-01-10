import mongoose from 'mongoose';

const { Schema } = mongoose;

const scheduleSchema = new Schema(
  {
    interviewDate: {
      type: Date,
      required: [true, "Interview date is required"],
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'Applicant',
      required: [true, "Applicant ID is required"],
    },
    meetingLink: {
      type: String,
      required: [true, "Meeting link is required"],
      validate: {
        validator: (v) =>
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v),
        message: "Invalid meeting link URL",
      },
    },
    interviewer: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, "Interviewer ID is required"],
    },
    interviewTime: {
      type: String,
      required: [true, "Interview time is required"],
      validate: {
        validator: (v) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v), // Validates HH:mm format
        message: "Invalid time format. Use HH:mm (24-hour format)",
      },
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for better query performance
scheduleSchema.index({ interviewDate: 1 });
scheduleSchema.index({ applicantId: 1 });
scheduleSchema.index({ interviewer: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
