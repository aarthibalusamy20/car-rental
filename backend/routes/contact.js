const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../middleware/asyncHandler');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for contact submissions
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5 // limit each IP to 5 contact requests per hour
});

router.post(
  '/',
  [
    contactLimiter,
    check('name', 'Name is required').notEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('subject', 'Subject must be between 5-200 characters').isLength({ min: 5, max: 200 }),
    check('message', 'Message must be between 10-2000 characters').isLength({ min: 10, max: 2000 })
  ],
  asyncHandler(async (req, res) => {
    // ✅ ADD THIS: To see the request data
    console.log('📩 Contact form submitted:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    // Here you would typically send an email notification
    // await sendContactEmail(contactMessage);

    res.status(201).json({
      success: true,
      data: {
        id: contactMessage._id,
        message: 'Your message has been received! We will respond soon.'
      }
    });
  })
);

module.exports = router;
