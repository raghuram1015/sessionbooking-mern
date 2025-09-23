const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session', // Reference to the Session model
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
});

// Ensure a user can only book a session once
BookingSchema.index({ user: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);