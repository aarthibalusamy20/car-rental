// backend/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send an email and log result
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
const sendEmail = async (to, subject, html) => {
  const timestamp = new Date().toLocaleString();
  try {
    await transporter.sendMail({
      from: `"Car Rental" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html
    });

    console.log(`✅ [${timestamp}] Email sent to: ${to} | Subject: "${subject}"`);
  } catch (error) {
    console.error(`❌ [${timestamp}] Failed to send email to: ${to}`);
    console.error(`   ↳ Reason: ${error.message}`);
  }
};

module.exports = sendEmail;
