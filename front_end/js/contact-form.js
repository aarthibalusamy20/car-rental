document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = form.querySelector('input[placeholder="Your Name"]').value;
    const email = form.querySelector('input[placeholder="Your Email"]').value;
    const subject = form.querySelector('input[placeholder="Subject"]').value;
    const message = form.querySelector('textarea[placeholder="Message"]').value;

    try {
      const response = await fetch('http://localhost:5000/api/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ Message sent successfully!");
        form.reset(); // clear form
      } else {
        alert("❌ Failed to send message.");
        console.error(data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Server error. Please try again later.");
    }
  });
});
