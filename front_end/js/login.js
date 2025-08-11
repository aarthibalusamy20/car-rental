document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token); // save token to use in bookings
      alert('✅ Login successful');
      window.location.href = 'index.html';
    } else {
      alert('❌ ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('❌ Server error');
  }
});
