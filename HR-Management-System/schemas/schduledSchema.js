import mongoose from 'mongoose';

const { Schema } = mongoose;

const scheduleSchema = new Schema({
    interviewDate: {
        type: Date,
        required: true
    },
    applicantId: {
        type: Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },
    interviewer: {
        type: String,
        required: true
    },
    interviewTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;