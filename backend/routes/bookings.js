const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const sendEmail = require('../utils/emailService');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
router.post(
  '/',
  [
    protect,
    check('carId', 'Car ID is required').notEmpty(),
    check('pickupDate', 'Valid pickup date required').isISO8601(),
    check('dropoffDate', 'Valid dropoff date required').isISO8601(),
    check('pickupLocation', 'Pickup location is required').notEmpty(),
    
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation Error', 400, errors.array()));
    }

    const { carId, pickupDate, dropoffDate } = req.body;

    if (new Date(pickupDate) >= new Date(dropoffDate)) {
      return next(new ErrorResponse('Dropoff date must be after pickup date', 400));
    }

    const car = await Car.findById(carId);
    if (!car) {
      return next(new ErrorResponse(`Car not found with id ${carId}`, 404));
    }

    const isAvailable = await car.isAvailable(pickupDate, dropoffDate);
    if (!isAvailable) {
      return next(new ErrorResponse('Car not available for selected dates', 400));
    }

    const booking = await Booking.create({
      ...req.body,
      userId: req.user.id,
      email: req.user.email
    });

    const days = Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    await sendConfirmationEmails(booking, car, totalPrice);

    res.status(201).json({
      success: true,
      data: booking
    });
  })
);

// @desc    Get bookings by logged-in user
// @route   GET /api/v1/bookings/user
// @access  Private
router.get(
  '/user',
  protect,
  asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: bookings });
  })
);

// ✅ NEW ROUTE: Check Car Availability
// @route   POST /api/v1/bookings/check-availability
// @access  Public
router.post(
  '/check-availability',
  asyncHandler(async (req, res) => {
    const { carId, pickupDate, dropoffDate } = req.body;

    if (!carId || !pickupDate || !dropoffDate) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const bookings = await Booking.find({
      carId,
      $or: [
        {
          pickupDate: { $lt: new Date(dropoffDate) },
          dropoffDate: { $gt: new Date(pickupDate) }
        }
      ]
    });

    const available = bookings.length === 0;

    if (!available) {
      return res.status(200).json({
        available: false,
        message: 'Car is already booked in this date range'
      });
    }

    return res.status(200).json({ available: true });
  })
);

// 📧 Helper function to send email notifications
const sendConfirmationEmails = async (booking, car, totalPrice) => {
  try {
    const days = Math.ceil((new Date(booking.dropoffDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24));

    const customerEmail = `
      <h1>Booking Confirmation #${booking._id}</h1>
      <p>Thank you for choosing our service!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Car: ${car.brand} ${car.name}</li>
        <li>Dates: ${new Date(booking.pickupDate).toLocaleDateString()} - ${new Date(booking.dropoffDate).toLocaleDateString()}</li>
        <li>Total Days: ${days}</li>
        <li>Price: ₹${car.pricePerDay}/day (Total: ₹${totalPrice})</li>
        <li>Pickup Location: ${booking.pickupLocation}</li>
      </ul>
    `;

    const adminEmail = `
      <h1>New Booking Notification</h1>
      <p>Customer: ${booking.email}</p>
      <p>Booking ID: ${booking._id}</p>
      <p>Car: ${car.brand} ${car.name}</p>
      <p>Total Revenue: ₹${totalPrice}</p>
    `;

    await sendEmail(booking.email, 'Your Booking Confirmation', customerEmail);
    await sendEmail(process.env.ADMIN_EMAIL, 'New Booking Notification', adminEmail);
  } catch (err) {
    console.error('Email sending error:', err);
  }
};

module.exports = router;
