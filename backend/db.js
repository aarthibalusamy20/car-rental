// backend/config/db.js
const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carbook', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: process.env.NODE_ENV === 'development'
    });

    console.log(colors.green.bold(`✅ MongoDB Connected: ${conn.connection.host}`));
    
    // Database event listeners
    mongoose.connection.on('connected', () => {
      console.log(colors.green.bold('Mongoose connected to DB'));
    });

    mongoose.connection.on('error', (err) => {
      console.error(colors.red.bold(`Mongoose connection error: ${err}`));
    });

    mongoose.connection.on('disconnected', () => {
      console.log(colors.yellow.bold('Mongoose disconnected'));
    });

    // Close connection on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log(colors.red.bold('Mongoose connection closed due to app termination'));
      process.exit(0);
    });

  } catch (err) {
    console.error(colors.red.bold(`❌ MongoDB Connection Error: ${err.message}`));
    process.exit(1);
  }
};

module.exports = connectDB;