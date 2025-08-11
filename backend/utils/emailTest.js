require('dotenv').config();
const sendEmail = require('./emailService');

const testEmail = async () => {
  try {
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'Test Email from Car Rental',
      '<h1>Test Successful!</h1><p>Your email system is working.</p>'
    );
    console.log('✅ Test email sent successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testEmail();