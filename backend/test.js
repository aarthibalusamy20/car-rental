require('dotenv').config();
const nodemailer = require('nodemailer');
const { emailTemplate } = require('./utils/emailTemplates');

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // For local testing only
  }
});

// Email content
const mailOptions = {
  from: `Carbook App <${process.env.MAIL_USER}>`,
  to: process.env.ADMIN_EMAIL || 'kavinvgn@gmail.com',
  subject: '🚗 Carbook System Test Email',
  html: emailTemplate(
    'Test Email Successful', 
    'Your Carbook email system is working correctly!',
    'This is a test email from your Carbook backend system.'
  ),
  attachments: [{
    filename: 'carbook-logo.png',
    path: path.join(__dirname, 'public/images/carbook-logo.png'),
    cid: 'logo'
  }]
};

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Mail server connection failed:', error);
  } else {
    console.log('✅ Mail server is ready to take our messages');
    
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Email sending failed:', error);
      } else {
        console.log('✅ Email sent successfully:', info.response);
        console.log('📧 Message ID:', info.messageId);
        console.log('👀 Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    });
  }
});