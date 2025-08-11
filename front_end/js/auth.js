document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginNav = document.querySelector('a[href="login.html"]')?.parentElement;
  const registerNav = document.querySelector('a[href="register.html"]')?.parentElement;
  const logoutNav = document.getElementById('logoutNav');
  const logoutBtn = document.getElementById('logoutBtn');

  // Show/Hide Login/Register/Logout
  if (token) {
    if (loginNav) loginNav.style.display = 'none';
    if (registerNav) registerNav.style.display = 'none';
    if (logoutNav) logoutNav.style.display = 'block';
  } else {
    if (loginNav) loginNav.style.display = 'block';
    if (registerNav) registerNav.style.display = 'block';
    if (logoutNav) logoutNav.style.display = 'none';
  }

  // Logout event
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('✅ Logged out successfully!');
      window.location.href = 'login.html';
    });
  }
});
