import express from 'express';
import Schedule from '../schemas/schduledSchema.js'
import mongoose from 'mongoose';
const scheduleRouter = express.Router();

const checkId = (id) => !mongoose.Types.ObjectId.isValid(id);
scheduleRouter.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
scheduleRouter.post('/create', async (req, res) => {
    try {
        const newSchedule = new Schedule(req.body);
        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
scheduleRouter.get('/:id', async (req, res) => {
    if (checkId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid job ID format",
          id: id,
        });
      }
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

scheduleRouter.put('/:id', async (req, res) => {
    if (checkId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid job ID format",
          id: id,
        });
      }
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(updatedSchedule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

scheduleRouter.delete('/:id', async (req, res) => {
    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!deletedSchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default scheduleRouter;