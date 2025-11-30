/*
  TCBA script.js
  Handles login, signup redirects, and backend communication
  Backend expected at: http://localhost:3000
*/

const API_BASE = "http://localhost:3000";

// =============================
// LOGIN HANDLER
// =============================
async function doLogin(event) {
    event.preventDefault();

    const userInput = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();
    const statusBox = document.getElementById("loginStatus");

    if (!userInput || !password) {
        statusBox.textContent = "Please enter username/email and password.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: userInput,
                password: password
            })
        });

        if (!response.ok) {
            statusBox.textContent = "Login failed.";
            return;
        }

        const data = await response.json();

        if (data.status === "approved") {
            window.location.href = "homepage.html";
        } else if (data.status === "pending") {
            window.location.href = "welcome.html";
        } else {
            statusBox.textContent = "Invalid login credentials.";
        }

    } catch (error) {
        statusBox.textContent = "Cannot reach the TCBA server.";
    }
}

// =============================
// SIGNUP REDIRECT
// =============================
function goSignup() {
    window.location.href = "signup.html";
}
