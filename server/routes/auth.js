// server/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// This is a temporary, in-memory "database" for demonstration purposes.
// In a real application, you would use a proper database like MongoDB.
const users = [];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation: check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check if user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // "Save" the new user (in a real app, you'd hash the password here)
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);

    console.log('Current users:', users); // Log users to the console for debugging
    res.status(201).json({ msg: 'User registered successfully!', user: { id: newUser.id, username: newUser.username } });

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token (login)
 * @access  Public
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Find the user
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password (in a real app, you'd use bcrypt.compare)
    if (user.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // If login is successful, send a success message
    // (In a real app, you would generate and send a JWT token here)
    res.status(200).json({ msg: 'Login successful!', user: { id: user.id, username: user.username } });

  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// You must export the router for server.js to use it
module.exports = router;