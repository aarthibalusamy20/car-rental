require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');

// Import DB connection
const connectDB = require('./config/db');

// Init app
const app = express();

// ======================
// 1. Connect Database
// ======================
connectDB();

// ======================
// 2. CORS Configuration
// ======================
const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Serve uploads BEFORE helmet so images aren't blocked
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// 3. Security Middlewares
// ======================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // ✅ Allow cross-origin images
}));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP parameter pollution

// ======================
// 4. Rate Limiting
// ======================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// ======================
// 5. Body Parsers
// ======================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ======================
// 6. Logging
// ======================
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// ======================
// 7. API Routes
// ======================
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/cars', require('./routes/cars'));
app.use('/api/v1/bookings', require('./routes/bookings'));
app.use('/api/v1/contact', require('./routes/contact'));

// ======================
// 8. Serve Frontend in Production
// ======================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// ======================
// 9. Error Handler
// ======================
app.use(errorHandler);

// ======================
// 10. Start Server
// ======================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// ======================
// 11. Handle Crashes
// ======================
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
