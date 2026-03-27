// ═══════════════════════════════════════════════════════════════════════════
// Car Management System · Main SPA Entry Point
// ═══════════════════════════════════════════════════════════════════════════

import { onAuth, signIn, signUp, signOut, isConfigured } from "./firebase.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderCars } from "./pages/cars.js";
import { renderServices } from "./pages/services.js";
import { renderHistory } from "./pages/history.js";

// ─── DOM Refs ────────────────────────────────────────────────────────────
const appEl = document.getElementById("app");
const authOverlay = document.getElementById("auth-overlay");
const mainContent = document.getElementById("main-content");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");

// ─── Toast System ────────────────────────────────────────────────────────
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

// ─── SPA Router ──────────────────────────────────────────────────────────
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

  // Render with loading state
  mainContent.innerHTML = '<div class="spinner"></div>';
  pages[page](mainContent);
}

// Hash routing
window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "dashboard";
  if (page !== currentPage) navigateTo(page);
});

// Nav clicks
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

  const name = user.displayName || user.email || "User";
  document.getElementById("user-name").textContent = name;
  document.getElementById("user-avatar").textContent = name.charAt(0).toUpperCase();

  const page = window.location.hash.replace("#", "") || "dashboard";
  navigateTo(page);
}

function exitApp() {
  authOverlay.classList.remove("hidden");
  appEl.classList.remove("authenticated");
  mainContent.innerHTML = "";
}

// Sign out
document.getElementById("btn-logout").addEventListener("click", async () => {
  await signOut();
  exitApp();
  showToast("Signed out successfully", "info");
});

// ─── Dev Mode ────────────────────────────────────────────────────────────
if (!isConfigured) {
  const notice = document.createElement("div");
  notice.style.cssText = `
    background:#fffaeb;border:1px solid #fec84b;border-radius:8px;
    padding:12px 16px;margin-bottom:20px;font-size:.825rem;
    color:#93370d;text-align:center;line-height:1.5;
  `;
  notice.innerHTML = '<strong style="display:block;margin-bottom:2px">Development Mode</strong>Firebase is not configured. Use the button below to enter as a demo user.';
  loginForm.prepend(notice);

  const devBtn = document.createElement("button");
  devBtn.type = "button";
  devBtn.className = "btn btn-secondary btn-full";
  devBtn.style.marginTop = "10px";
  devBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v6m0 0l2.5-2.5M8 7L5.5 4.5M2 10v2a2 2 0 002 2h8a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>Enter Demo Mode</span>
  `;
  devBtn.addEventListener("click", () => {
    enterApp({ displayName: "Developer", email: "dev@smartcar.local", uid: "dev-user" });
    showToast("Welcome! You're in demo mode", "info");
  });
  loginForm.appendChild(devBtn);

  window.addEventListener("dev-logout", () => exitApp());
}

// ─── Firebase Auth Listener ──────────────────────────────────────────────
if (isConfigured) {
  onAuth((user) => {
    if (user) enterApp(user);
    else exitApp();
  });
}

// ─── Login Submit ────────────────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isConfigured) return;
  const btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.querySelector("span").textContent = "Signing in…";
  try {
    await signIn(
      document.getElementById("login-email").value.trim(),
      document.getElementById("login-password").value
    );
  } catch (err) {
    showToast(err.message, "error");
    btn.disabled = false;
    btn.querySelector("span").textContent = "Sign In";
  }
});

// ─── Register Submit ─────────────────────────────────────────────────────
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isConfigured) return;
  const btn = document.getElementById("register-btn");
  btn.disabled = true;
  btn.querySelector("span").textContent = "Creating account…";
  try {
    await signUp(
      document.getElementById("register-email").value.trim(),
      document.getElementById("register-password").value,
      document.getElementById("register-name").value.trim()
    );
    showToast("Account created successfully! 🎉", "success");
  } catch (err) {
    showToast(err.message, "error");
    btn.disabled = false;
    btn.querySelector("span").textContent = "Create Account";
  }
});
