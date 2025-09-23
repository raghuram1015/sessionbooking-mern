const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Import Booking model
const Session = require('../models/Session'); // To check if session exists

// @route   POST api/bookings
// @desc    Create a new booking for a session
// @access  Private (for logged-in users)
router.post('/', async (req, res) => {
    // Note: In a real app, you'd get the userId from the JWT token (e.g., req.user.id)
    const { userId, sessionId } = req.body; 

    try {
        // Check if session exists
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        // Check if user already booked this session
        let existingBooking = await Booking.findOne({ user: userId, session: sessionId });
        if (existingBooking) {
            return res.status(400).json({ msg: 'You have already booked this session' });
        }

        const newBooking = new Booking({
            user: userId,
            session: sessionId,
        });

        const booking = await newBooking.save();
        res.status(201).json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bookings/my-bookings
// @desc    Get all bookings for a user
// @access  Private
router.get('/my-bookings/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).populate('session');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;