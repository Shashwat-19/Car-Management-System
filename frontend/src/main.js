// ═══════════════════════════════════════════════════════════════════════════
// SmartCar-Care — Main SPA Entry Point
// ═══════════════════════════════════════════════════════════════════════════

import { onAuth, signIn, signUp, signOut, isConfigured } from "./firebase.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderCars } from "./pages/cars.js";
import { renderServices } from "./pages/services.js";
import { renderHistory } from "./pages/history.js";

// ─── DOM refs ────────────────────────────────────────────────────────────
const appEl = document.getElementById("app");
const authOverlay = document.getElementById("auth-overlay");
const mainContent = document.getElementById("main-content");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");

// ─── Toast helper ────────────────────────────────────────────────────────
export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "toastSlideOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── Navigation ──────────────────────────────────────────────────────────
const pages = {
  dashboard: renderDashboard,
  cars: renderCars,
  services: renderServices,
  history: renderHistory,
};

let currentPage = "dashboard";

export function navigateTo(page) {
  if (!pages[page]) page = "dashboard";
  currentPage = page;
  window.location.hash = page;

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  // Render page
  mainContent.innerHTML = '<div class="spinner"></div>';
  pages[page](mainContent);
}

// Hash routing
window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "dashboard";
  navigateTo(page);
});

// Sidebar link clicks
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// ─── Auth Toggle ─────────────────────────────────────────────────────────
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  registerForm.style.display = "";
});

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.style.display = "none";
  loginForm.style.display = "";
});

// ─── Auth Handling ───────────────────────────────────────────────────────
function enterApp(user) {
  authOverlay.classList.add("hidden");
  appEl.classList.add("authenticated");

  // Update sidebar
  const name = user.displayName || user.email || "User";
  document.getElementById("user-name").textContent = name;
  document.getElementById("user-avatar").textContent = name.charAt(0).toUpperCase();

  // Navigate to current hash or dashboard
  const page = window.location.hash.replace("#", "") || "dashboard";
  navigateTo(page);
}

function exitApp() {
  authOverlay.classList.remove("hidden");
  appEl.classList.remove("authenticated");
  mainContent.innerHTML = "";
}

// Sign-out button
document.getElementById("btn-logout").addEventListener("click", async () => {
  await signOut();
  exitApp();
  showToast("Signed out", "info");
});

// ─── Dev-mode auto-login (when Firebase is not configured) ───────────────
if (!isConfigured) {
  // Show a dev-mode notice + auto-login button in login form
  const notice = document.createElement("div");
  notice.style.cssText =
    "background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:14px;margin-bottom:20px;font-size:0.85rem;color:#fbbf24;text-align:center;";
  notice.innerHTML =
    '<strong>Dev Mode</strong><br>Firebase is not configured. Click below to enter as a demo user.';
  loginForm.prepend(notice);

  const devBtn = document.createElement("button");
  devBtn.type = "button";
  devBtn.className = "btn btn-secondary btn-full";
  devBtn.style.marginTop = "10px";
  devBtn.textContent = "Enter Dev Mode 🔓";
  devBtn.addEventListener("click", () => {
    enterApp({ displayName: "Developer", email: "dev@smartcar.local", uid: "dev-user" });
    showToast("Welcome to Dev Mode! 🔓", "info");
  });
  loginForm.appendChild(devBtn);

  // Also listen for programmatic dev-logout
  window.addEventListener("dev-logout", () => exitApp());
}

// ─── Firebase auth state listener ───────────────────────────────────────
if (isConfigured) {
  onAuth((user) => {
    if (user) {
      enterApp(user);
    } else {
      exitApp();
    }
  });
}

// ─── Login form submit ──────────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isConfigured) return;
  const btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.textContent = "Signing in…";
  try {
    await signIn(
      document.getElementById("login-email").value.trim(),
      document.getElementById("login-password").value
    );
  } catch (err) {
    showToast(err.message, "error");
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
});

// ─── Register form submit ───────────────────────────────────────────────
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isConfigured) return;
  const btn = document.getElementById("register-btn");
  btn.disabled = true;
  btn.textContent = "Creating account…";
  try {
    await signUp(
      document.getElementById("register-email").value.trim(),
      document.getElementById("register-password").value,
      document.getElementById("register-name").value.trim()
    );
    showToast("Account created! Welcome 🎉", "success");
  } catch (err) {
    showToast(err.message, "error");
    btn.disabled = false;
    btn.textContent = "Create Account";
  }
});
