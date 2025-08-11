// backend/utils/emailTemplates.js
module.exports = {
  bookingConfirmation: (booking, car) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { max-width: 150px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
            .details { margin: 15px 0; }
            .detail-item { margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:logo" alt="Car Rental Logo" class="logo">
                <h1>Booking Confirmation</h1>
            </div>
            <div class="content">
                <h2>Thank you for your booking!</h2>
                <div class="details">
                    <div class="detail-item"><strong>Car:</strong> ${car.brand} ${car.name}</div>
                    <div class="detail-item"><strong>Pickup:</strong> ${new Date(booking.pickupDate).toLocaleDateString()} at ${booking.pickupTime}</div>
                    <div class="detail-item"><strong>Dropoff:</strong> ${new Date(booking.dropoffDate).toLocaleDateString()}</div>
                    <div class="detail-item"><strong>Location:</strong> ${booking.pickupLocation}</div>
                    <div class="detail-item"><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</div>
                    <div class="detail-item"><strong>Booking ID:</strong> ${booking._id}</div>
                </div>
                <p>We look forward to serving you. Please contact us if you have any questions.</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Car Rental App. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `,

  adminNotification: (booking, car, userEmail) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
            .details { margin: 15px 0; }
            .detail-item { margin-bottom: 10px; }
            .alert { color: #d9534f; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="alert">New Booking Notification</h1>
            </div>
            <div class="content">
                <h2>Booking Details</h2>
                <div class="details">
                    <div class="detail-item"><strong>Booking ID:</strong> ${booking._id}</div>
                    <div class="detail-item"><strong>Customer:</strong> ${userEmail}</div>
                    <div class="detail-item"><strong>Car:</strong> ${car.brand} ${car.name}</div>
                    <div class="detail-item"><strong>Dates:</strong> ${new Date(booking.pickupDate).toLocaleDateString()} - ${new Date(booking.dropoffDate).toLocaleDateString()}</div>
                    <div class="detail-item"><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</div>
                </div>
                <p>Please prepare the vehicle and confirm availability.</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Car Rental App. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
};