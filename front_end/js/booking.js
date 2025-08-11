document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const bookingData = {
        pickupLocation: formData.get('pickup_location'),
        dropoffLocation: formData.get('dropoff_location'),
        pickupDate: formData.get('pickup_date'),
        dropoffDate: formData.get('dropoff_date'),
        pickupTime: formData.get('pickup_time'),
        email: "user@example.com" // TODO: Replace with actual logged-in user's email
      };

      try {
        const response = await fetch('http://localhost:5000/api/v1/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
          alert('✅ Booking submitted successfully!');
          bookingForm.reset();
        } else {
          alert(`❌ Booking failed: ${result.message || 'Server error'}`);
        }
      } catch (error) {
        console.error('Error submitting booking:', error);
        alert('❌ Network error. Please try again later.');
      }
    });
  }
});
