const express = require('express');
const router = express.Router();
const Session = require('../models/Session'); // Import Session model

// @route   POST api/sessions
// @desc    Create a new session
// @access  Private (e.g., only for admins or specific users)
router.post('/', async (req, res) => {
    const { title, description, startTime, endTime } = req.body;
    try {
        const newSession = new Session({
            title,
            description,
            startTime,
            endTime
        });
        const session = await newSession.save();
        res.status(201).json(session);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sessions
// @desc    Get all available sessions
// @access  Public
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ startTime: 1 }); // Sort by start time
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
