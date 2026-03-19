// ═══════════════════════════════════════════════════════════════════════════
// API Client
// Wraps fetch and automatically attaches the Firebase ID token.
// ═══════════════════════════════════════════════════════════════════════════

import { getIdToken, isConfigured } from "./firebase.js";

const BASE = "/api";

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (isConfigured) {
    const token = await getIdToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  // In dev mode: no auth header is sent; backend allows it

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "API request failed");
  }
  return data;
}

// ─── Cars ────────────────────────────────────────────────────────────────

export function listCars() {
  return request("/cars");
}

export function getCar(id) {
  return request(`/cars/${id}`);
}

export function registerCar(body) {
  return request("/cars", { method: "POST", body: JSON.stringify(body) });
}

export function deleteCar(id) {
  return request(`/cars/${id}`, { method: "DELETE" });
}

// ─── Services ────────────────────────────────────────────────────────────

export function bookService(body) {
  return request("/services", { method: "POST", body: JSON.stringify(body) });
}

export function getServiceHistory(carId) {
  return request(`/services/${carId}`);
}

export function getAllServices() {
  return request("/services");
}
