const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const advancedResults = require('../middleware/advancedResults');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const { multiUpload } = require('../middleware/upload'); // ✅ multer upload handler

// GET all cars
router.get(
  '/',
  advancedResults(Car),
  asyncHandler(async (req, res) => {
    res.status(200).json(res.advancedResults);
  })
);

// POST - Upload one car with multiple image files
router.post(
  '/',
  [
    protect,
    authorize('admin'),
    multiUpload,
    check('name', 'Name is required').notEmpty(),
    check('brand', 'Brand is required').notEmpty(),
    check('pricePerDay', 'Valid price is required').isFloat({ min: 0 }),
    check('mileage', 'Mileage is required').notEmpty(),
    check('transmission', 'Transmission is required').notEmpty(),
    check('seats', 'Seats must be a number').isInt({ min: 2 }),
    check('luggage', 'Luggage must be a number').isInt({ min: 1 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const imageFilenames = req.files ? req.files.map(file => 'uploads/' + file.filename) : [];

    const carData = {
      ...req.body,
      images: imageFilenames // ✅ Store image paths like 'uploads/camry.jpg'
    };

    const car = await Car.create(carData);
    res.status(201).json({ success: true, data: car });
  })
);

// POST - Bulk insert cars (uses local image paths)
router.post(
  '/bulk',
  [
    protect,
    authorize('admin')
  ],
  asyncHandler(async (req, res) => {
    const cars = req.body;

    if (!Array.isArray(cars) || cars.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of car objects'
      });
    }

    const insertedCars = await Car.insertMany(cars);
    res.status(201).json({
      success: true,
      count: insertedCars.length,
      data: insertedCars
    });
  })
);

// PUT - Update car
router.put(
  '/:id',
  [
    protect,
    authorize('admin'),
    check('name').optional().notEmpty(),
    check('pricePerDay').optional().isFloat({ min: 0 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        error: `Car not found with id ${req.params.id}`
      });
    }

    res.status(200).json({ success: true, data: car });
  })
);

// DELETE - Delete car
router.delete(
  '/:id',
  [protect, authorize('admin')],
  asyncHandler(async (req, res) => {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        error: `Car not found with id ${req.params.id}`
      });
    }

    res.status(200).json({ success: true, data: {} });
  })
);

module.exports = router;
