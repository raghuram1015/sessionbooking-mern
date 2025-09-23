const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model

// @route   GET api/users
// @desc    Get all users (for admin purposes, should be protected)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from result
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) { // <-- ADDED the opening curly brace here
        console.error(err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    } // <-- And ADDED the closing curly brace here
});

module.exports = router;

