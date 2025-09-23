const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Tech', 'Career', 'Design'],
    default: 'Tech'
  },
  dateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked'],
    default: 'available'
  }
});

module.exports = mongoose.model('Session', sessionSchema);
