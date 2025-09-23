const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file here
dotenv.config();

// Import route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const bookingRoutes = require('./routes/bookings');

// Initialize the express app
const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Enable the express app to parse JSON formatted request bodies
app.use(express.json());

// --- MongoDB Connection ---
// Check if the MongoDB URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in .env file.');
  process.exit(1); // Exit the process with an error code
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// --- API Routes ---
// Mount the imported routes to their respective paths
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/bookings', bookingRoutes);

// --- Root Endpoint ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
