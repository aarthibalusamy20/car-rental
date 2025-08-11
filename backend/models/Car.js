const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a car name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  image: {
  type: String,
  required: [true, 'Image path is required'],
  trim: true
   },
  
  mileage: {
    type: String,
    required: [true, 'Please add mileage info']
  },
  transmission: {
    type: String,
    required: [true, 'Please specify transmission type'],
    enum: ['Automatic', 'Manual']
  },
  seats: {
    type: Number,
    required: [true, 'Please specify number of seats'],
    min: [2, 'Seats cannot be less than 2']
  },
  luggage: {
    type: Number,
    required: [true, 'Please specify luggage capacity'],
    min: [1, 'Luggage capacity cannot be less than 1']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add a price per day'],
    min: [0, 'Price cannot be negative']
  },
  features: {
    type: [String],
    default: []
  },
  availability: {
    type: [{
      from: {
        type: Date,
        required: [true, 'Start date is required']
      },
      to: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
          validator: function(value) {
            return value > this.from;
          },
          message: 'End date must be after start date'
        }
      }
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
carSchema.index({ brand: 1, pricePerDay: 1 });
carSchema.index({ 'availability.from': 1, 'availability.to': 1 });

/**
 * Check if car is available for given dates
 * @param {Date|String} pickupDate - Start date of booking
 * @param {Date|String} dropoffDate - End date of booking
 * @returns {Promise<Boolean>} - True if available, false if not
 * @throws {Error} - If dates are invalid
 */
carSchema.methods.isAvailable = async function(pickupDate, dropoffDate) {
  // Convert to Date objects if they aren't already
  const startDate = new Date(pickupDate);
  const endDate = new Date(dropoffDate);
  
  // Validate dates
  if (startDate >= endDate) {
    throw new Error('Dropoff date must be after pickup date');
  }

  // 1. Check against the car's availability slots
  if (this.availability && this.availability.length > 0) {
    const isInAvailability = this.availability.some(slot => {
      return startDate >= new Date(slot.from) && 
             endDate <= new Date(slot.to);
    });
    if (!isInAvailability) return false;
  }

  // 2. Check against existing bookings
  const conflictingBookings = await mongoose.model('Booking').find({
    carId: this._id,
    $or: [
      { pickupDate: { $lte: endDate } },
      { dropoffDate: { $gte: startDate } }
    ]
  });

  return conflictingBookings.length === 0;
};

/**
 * Get all available cars within a date range
 * @param {Date} from - Start date
 * @param {Date} to - End date
 * @returns {Promise<Array>} - Array of available cars
 */
carSchema.statics.findAvailable = async function(from, to) {
  return this.find({
    $or: [
      { availability: { $eq: [] } }, // Cars with no availability restrictions
      { 
        availability: {
          $elemMatch: {
            from: { $lte: new Date(from) },
            to: { $gte: new Date(to) }
          }
        }
      }
    ]
  });
};

module.exports = mongoose.model('Car', carSchema);