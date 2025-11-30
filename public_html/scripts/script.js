// =============================================
// Treasure Coast Bee Association Frontend Script
// (Full Replacement File - 2025 Edition)
// =============================================
const API_URL = "https://tcba-api.onrender.com";

// 🌐 Backend API endpoint (local for testing)
const API_URL = "http://localhost:3000";

// === Generic POST Helper ===
const API_URL = "https://tcba-api.onrender.com";

async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("❌ Connection error:", error);
    alert("⚠️ Cannot reach the TCBA server. Make sure it's running.");
    throw error;
  }
}

// === LOGIN ===
async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Please enter both your email and password.");
    return;
  }

  const result = await postData("/login", { email, password });

  if (result.success) {
    localStorage.setItem("tcbaUser", JSON.stringify(result.user));
    alert(`🐝 Welcome back, ${result.user.name}!`);
    window.location.href = "welcome.html";
  } else {
    alert(result.error || "Invalid email or password.");
  }
}

// === SIGNUP ===
async function signupUser(event) {
  event.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const result = await postData("/signup", { name, email, password });

  if (result.success) {
    alert(`🎉 Signup successful! Welcome, ${name}!`);
    window.location.href = "login.html";
  } else {
    alert(result.error || "Signup failed. Try again.");
  }
}

// === LOAD USER ON WELCOME PAGE ===
function loadUserData() {
  const userData = localStorage.getItem("tcbaUser");
  if (userData) {
    const user = JSON.parse(userData);
    const welcomeSpan = document.getElementById("welcome-name");
    if (welcomeSpan) welcomeSpan.textContent = user.name || "Member";
  } else {
    window.location.href = "login.html";
  }
}

// === LOGOUT FUNCTION ===
function logoutUser() {
  localStorage.removeItem("tcbaUser");
  alert("You have been logged out.");
  window.location.href = "login.html";
}

// === Event Listeners Setup ===
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const logoutBtn = document.getElementById("logout-btn");
  const welcomeName = document.getElementById("welcome-name");

  if (loginForm) loginForm.addEventListener("submit", loginUser);
  if (signupForm) signupForm.addEventListener("submit", signupUser);
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
  if (welcomeName) loadUserData();
});
