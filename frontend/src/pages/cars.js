// ═══════════════════════════════════════════════════════════════════════════
// My Cars Page
// ═══════════════════════════════════════════════════════════════════════════

import { listCars, registerCar, deleteCar } from "../api.js";
import { showToast } from "../main.js";

export async function renderCars(container) {
  container.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h1>My Cars</h1>
        <p>Manage your registered vehicles</p>
      </div>
      <button class="btn btn-primary" id="btn-add-car">➕ Add Car</button>
    </div>
    <div id="cars-content"><div class="spinner"></div></div>
  `;

  document.getElementById("btn-add-car").addEventListener("click", () => openAddCarModal(container));

  await loadCars(container);
}

async function loadCars(container) {
  const content = document.getElementById("cars-content");
  try {
    const cars = await listCars();

    if (!cars.length) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🚗</div>
          <h3>No cars registered yet</h3>
          <p>Click "Add Car" to register your first vehicle.</p>
        </div>`;
      return;
    }

    content.innerHTML = `<div class="car-grid">${cars
      .map(
        (c) => `
      <div class="car-card" data-id="${c.id}">
        <div class="car-card-header">
          <span class="car-card-number">${c.car_number}</span>
        </div>
        <div class="car-card-model">${c.model}</div>
        <div class="car-card-meta">
          <span>👤</span> ${c.owner_name} &nbsp;·&nbsp;
          <span>📅</span> ${new Date(c.registered_at).toLocaleDateString()}
        </div>
        <div class="car-card-actions">
          <button class="btn btn-danger btn-sm btn-delete-car" data-id="${c.id}">🗑️ Remove</button>
        </div>
      </div>`
      )
      .join("")}</div>`;

    // Delete handlers
    content.querySelectorAll(".btn-delete-car").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this car and its service history?")) return;
        try {
          await deleteCar(btn.dataset.id);
          showToast("Car removed successfully", "success");
          await loadCars(container);
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    });
  } catch (err) {
    content.innerHTML = `<p style="color:var(--accent-danger);">Failed to load cars: ${err.message}</p>`;
  }
}

function openAddCarModal(container) {
  // Remove existing modal if any
  const existing = document.querySelector(".modal-backdrop");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Register New Car</h3>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <form id="add-car-form">
        <div class="form-group">
          <label for="car-owner">Owner Name</label>
          <input type="text" id="car-owner" placeholder="e.g. Shashwat" required />
        </div>
        <div class="form-group">
          <label for="car-number">Car Number</label>
          <input type="text" id="car-number" placeholder="e.g. KA-01-AB-1234" required />
        </div>
        <div class="form-group">
          <label for="car-model">Model</label>
          <input type="text" id="car-model" placeholder="e.g. Hyundai Creta 2024" required />
        </div>
        <button type="submit" class="btn btn-primary btn-full">Register Car</button>
      </form>
    </div>
  `;
  document.body.appendChild(backdrop);

  // Close modal
  const close = () => backdrop.remove();
  backdrop.querySelector("#modal-close").onclick = close;
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });

  // Submit
  backdrop.querySelector("#add-car-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Registering…";
    try {
      await registerCar({
        owner_name: document.getElementById("car-owner").value.trim(),
        car_number: document.getElementById("car-number").value.trim(),
        model: document.getElementById("car-model").value.trim(),
      });
      showToast("Car registered successfully! 🚗", "success");
      close();
      await loadCars(container);
    } catch (err) {
      showToast(err.message, "error");
      btn.disabled = false;
      btn.textContent = "Register Car";
    }
  });
}
