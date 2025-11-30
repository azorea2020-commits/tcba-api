// ============================
// TCBA Login Script
// ============================

// Detect backend environment
const API_BASE = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://tcba-api.onrender.com';

// Grab elements
const loginForm = document.getElementById('login-form');
const loginInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginOverlay = document.getElementById('login-overlay');
const loadingIndicator = document.getElementById('loading');
const statusText = document.getElementById('status');

// Add event listener for form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission

  // Get the input values
  const loginValue = loginInput.value.trim();
  const password = passwordInput.value.trim();

  // Simple validation
  if (!loginValue || !password) {
    statusText.innerText = 'Please enter both username/email and password.';
    return;
  }

  // Show loading overlay
  loadingIndicator.classList.add('show');
  statusText.innerText = 'Logging in...';

  // Email validation pattern (optional)
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmail = emailPattern.test(loginValue);

  console.log('Login attempt →', loginValue, '(email format:', isEmail, ')');

  // Send request to backend
  fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usernameOrEmail: loginValue,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Backend response:', data);
      if (data.success) {
        processLoginResult(true);
      } else {
        processLoginResult(false, data.message || 'Incorrect credentials.');
      }
    })
    .catch((error) => {
      console.error('Network error:', error);
      processLoginResult(false, 'Network error. Please try again later.');
    });
});

// ============================
// Handle login result
// ============================

function processLoginResult(success, message) {
  if (success) {
    console.log('✅ Login successful — hiding overlay');
    loginOverlay.classList.add('hidden');
    statusText.innerText = 'Login successful! Redirecting...';

    // Clear input fields
    loginInput.value = '';
    passwordInput.value = '';

    // Fade-out and redirect
    document.body.style.backgroundColor = 'white';
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  } else {
    console.warn('❌ Login failed:', message);
    statusText.innerText = message || 'Login failed.';
  }

  // Hide loading indicator
  loadingIndicator.classList.remove('show');
}
