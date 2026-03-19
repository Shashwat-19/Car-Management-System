// ═══════════════════════════════════════════════════════════════════════════
// Services Page — Book a service for one of your cars
// ═══════════════════════════════════════════════════════════════════════════

import { listCars, bookService } from "../api.js";
import { showToast, navigateTo } from "../main.js";

export async function renderServices(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>Book a Service</h1>
      <p>Schedule maintenance for your vehicles</p>
    </div>
    <div id="services-content"><div class="spinner"></div></div>
  `;

  try {
    const cars = await listCars();

    if (!cars.length) {
      document.getElementById("services-content").innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🚗</div>
          <h3>No cars registered</h3>
          <p>Register a car first before booking a service.</p>
          <button class="btn btn-primary" id="go-cars">Go to My Cars</button>
        </div>`;
      document.getElementById("go-cars").onclick = () => navigateTo("cars");
      return;
    }

    const serviceTypes = [
      { value: "Car Wash", icon: "🚿", desc: "Complete exterior & interior wash", color: "badge-wash" },
      { value: "Car Paint", icon: "🎨", desc: "Full body paint & polish", color: "badge-paint" },
      { value: "Oil Change", icon: "🛢️", desc: "Engine oil replacement", color: "badge-oil" },
    ];

    document.getElementById("services-content").innerHTML = `
      <form id="service-form" style="max-width:560px;">
        <div class="form-group">
          <label for="service-car">Select Car</label>
          <select id="service-car" required>
            <option value="">Choose a vehicle…</option>
            ${cars.map((c) => `<option value="${c.id}">${c.car_number} — ${c.model}</option>`).join("")}
          </select>
        </div>

        <label style="display:block;font-size:0.8rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Choose Service</label>
        <div class="action-grid" style="margin-bottom:24px;">
          ${serviceTypes
            .map(
              (s) => `
            <div class="action-card service-type-card" data-type="${s.value}">
              <div class="action-card-icon">${s.icon}</div>
              <h4>${s.value}</h4>
              <p>${s.desc}</p>
            </div>`
            )
            .join("")}
        </div>
        <input type="hidden" id="service-type-val" required />

        <div class="form-group">
          <label for="service-notes">Notes (optional)</label>
          <textarea id="service-notes" rows="3" placeholder="Any specific requests…"></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-full" id="book-btn">Book Service</button>
      </form>
    `;

    // Service type selection
    let selectedType = "";
    document.querySelectorAll(".service-type-card").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".service-type-card").forEach((c) => (c.style.borderColor = ""));
        card.style.borderColor = "var(--accent-primary)";
        card.style.boxShadow = "var(--shadow-glow)";
        selectedType = card.dataset.type;
        document.getElementById("service-type-val").value = selectedType;
      });
    });

    // Submit
    document.getElementById("service-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!selectedType) {
        showToast("Please select a service type", "error");
        return;
      }
      const btn = document.getElementById("book-btn");
      btn.disabled = true;
      btn.textContent = "Booking…";

      try {
        await bookService({
          car_id: parseInt(document.getElementById("service-car").value),
          service_type: selectedType,
          notes: document.getElementById("service-notes").value.trim(),
        });
        showToast(`${selectedType} booked successfully! ✅`, "success");
        navigateTo("history");
      } catch (err) {
        showToast(err.message, "error");
        btn.disabled = false;
        btn.textContent = "Book Service";
      }
    });
  } catch (err) {
    document.getElementById("services-content").innerHTML = `<p style="color:var(--accent-danger);">${err.message}</p>`;
  }
}
