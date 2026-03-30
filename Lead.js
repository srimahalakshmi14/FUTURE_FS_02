const mongoose = require('mongoose');

const leadNoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['website', 'walk-in', 'phone', 'social-media', 'referral'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted'],
    default: 'new'
  },
  eventType: {
    type: String,
    required: true
  },
  guestCount: {
    type: Number,
    required: true,
    min: 1
  },
  notes: [leadNoteSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
