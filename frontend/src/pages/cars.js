// ═══════════════════════════════════════════════════════════════════════════
// My Cars Page v2
// ═══════════════════════════════════════════════════════════════════════════

import { listCars, registerCar, deleteCar } from "../api.js";
import { showToast } from "../main.js";

export async function renderCars(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>My Cars</h1>
        <p>Manage your registered vehicles</p>
      </div>
      <button class="btn btn-primary" id="btn-add-car">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span>Add Car</span>
      </button>
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
          <div class="empty-state-icon">🚘</div>
          <h3>No vehicles registered yet</h3>
          <p>Add your first car to get started with service tracking.</p>
          <button class="btn btn-primary" id="empty-add-car">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Register Your First Car</span>
          </button>
        </div>`;
      document.getElementById("empty-add-car")?.addEventListener("click", () => openAddCarModal(container));
      return;
    }

    content.innerHTML = `
      <div class="car-grid">${cars
        .map(
          (c) => `
        <div class="car-card">
          <div class="car-card-header">
            <span class="car-card-number">${c.car_number}</span>
          </div>
          <div class="car-card-model">${c.model}</div>
          <div class="car-card-meta">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="currentColor" stroke-width="1.2"/><path d="M2 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            ${c.owner_name}
            <span style="margin:0 4px;opacity:.3">•</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M2 6h10M5 1.5v3m4-3v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            ${new Date(c.registered_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          <div class="car-card-actions">
            <button class="btn btn-danger btn-sm btn-delete-car" data-id="${c.id}">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1m1 0v7a1 1 0 01-1 1H5a1 1 0 01-1-1V4h6z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Remove</span>
            </button>
          </div>
        </div>`
        )
        .join("")}
      </div>`;

    content.querySelectorAll(".btn-delete-car").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this car and all its service history?")) return;
        try {
          await deleteCar(btn.dataset.id);
          showToast("Vehicle removed", "success");
          await loadCars(container);
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    });
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Could not load vehicles</h3><p>${err.message}</p></div>`;
  }
}

function openAddCarModal(container) {
  document.querySelector(".modal-backdrop")?.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Register New Vehicle</h3>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <form id="add-car-form">
        <div class="form-group">
          <label for="car-owner">Owner Name</label>
          <input type="text" id="car-owner" placeholder="e.g. Shashwat" required />
        </div>
        <div class="form-group">
          <label for="car-number">Registration Number</label>
          <input type="text" id="car-number" placeholder="e.g. KA-01-AB-1234" required />
        </div>
        <div class="form-group">
          <label for="car-model">Vehicle Model</label>
          <input type="text" id="car-model" placeholder="e.g. Hyundai Creta 2024" required />
        </div>
        <div style="display:flex;gap:10px;margin-top:24px">
          <button type="button" class="btn btn-secondary" id="modal-cancel" style="flex:1">Cancel</button>
          <button type="submit" class="btn btn-primary" style="flex:2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Register</span>
          </button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  backdrop.querySelector("#modal-close").onclick = close;
  backdrop.querySelector("#modal-cancel").onclick = close;
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });

  backdrop.querySelector("#add-car-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.querySelector("span").textContent = "Registering…";
    try {
      await registerCar({
        owner_name: document.getElementById("car-owner").value.trim(),
        car_number: document.getElementById("car-number").value.trim(),
        model: document.getElementById("car-model").value.trim(),
      });
      showToast("Vehicle registered successfully", "success");
      close();
      await loadCars(container);
    } catch (err) {
      showToast(err.message, "error");
      btn.disabled = false;
      btn.querySelector("span").textContent = "Register";
    }
  });
}
