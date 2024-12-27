import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const zoomRouter = express.Router();

const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;
const ZOOM_API_URL = process.env.ZOOM_BASE_URL;

const generateZoomToken = () => {
    const payload = {
        iss: ZOOM_API_KEY,
        exp: ((new Date()).getTime() + 5000)
    };
    return jwt.sign(payload, ZOOM_API_SECRET);
};

zoomRouter.post('/createMeeting', async (req, res) => {
    const token = generateZoomToken();
    const meetingDetails = {
        topic: req.body.topic,
        type: 1,
        start_time: new Date(),
        duration: req.body.duration,
        timezone: 'UTC',
        agenda: req.body.agenda,
        settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            water_mark: true,
            use_pmi: false,
            approval_type: 1,
            audio: 'both',
            auto_recording: 'none',
            enforce_login: false,
            registrants_email_notification: false
        }
    };

    try {
        const response = await axios.post(`${ZOOM_API_URL}/users/me/meetings`, meetingDetails, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default zoomRouter;