const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  userId: {  // Add this field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Dropoff location is required'],
    trim: true
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  dropoffDate: {
    type: Date,
    required: [true, 'Dropoff date is required'],
    validate: {
      validator: function(value) {
        return value > this.pickupDate;
      },
      message: 'Dropoff date must be after pickup date'
    }
  },
  pickupTime: {
    type: String,
    required: [true, 'Pickup time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);