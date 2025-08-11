document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch('http://localhost:5000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Registered successfully');
      window.location.href = 'login.html';
    } else {
      alert('❌ ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('❌ Server error');
  }
});
