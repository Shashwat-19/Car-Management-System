// ═══════════════════════════════════════════════════════════════════════════
// Services Page v2 — Book a service
// ═══════════════════════════════════════════════════════════════════════════

import { listCars, bookService } from "../api.js";
import { showToast, navigateTo } from "../main.js";

export async function renderServices(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Book a Service</h1>
        <p>Schedule maintenance for your vehicles</p>
      </div>
    </div>
    <div id="services-content"><div class="spinner"></div></div>
  `;

  try {
    const cars = await listCars();

    if (!cars.length) {
      document.getElementById("services-content").innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🚗</div>
          <h3>No vehicles registered</h3>
          <p>You need to register a car before booking a service.</p>
          <button class="btn btn-primary" id="go-cars">Go to My Cars</button>
        </div>`;
      document.getElementById("go-cars").onclick = () => navigateTo("cars");
      return;
    }

    const serviceTypes = [
      { value: "Car Wash", icon: "🚿", desc: "Complete exterior & interior cleaning", bg: "var(--blue-50)", border: "var(--blue-200)" },
      { value: "Car Paint", icon: "🎨", desc: "Full body paint job & polish", bg: "var(--violet-50)", border: "#e4e0ff" },
      { value: "Oil Change", icon: "🛢️", desc: "Engine oil & filter replacement", bg: "var(--amber-50)", border: "#fde68a" },
    ];

    document.getElementById("services-content").innerHTML = `
      <div style="max-width:600px">
        <div style="background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius-xl);padding:32px;box-shadow:var(--shadow-xs)">
          <form id="service-form">
            <div class="form-group">
              <label for="service-car">Select Vehicle</label>
              <select id="service-car" required>
                <option value="">Choose a vehicle…</option>
                ${cars.map((c) => `<option value="${c.id}">${c.car_number} — ${c.model}</option>`).join("")}
              </select>
            </div>

            <label style="display:block;font-size:.8rem;font-weight:600;color:var(--gray-700);margin-bottom:10px">Service Type</label>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px">
              ${serviceTypes
                .map(
                  (s) => `
                <div class="service-type-card" data-type="${s.value}" style="
                  padding:20px 14px;border-radius:var(--radius-lg);text-align:center;
                  cursor:pointer;border:2px solid var(--gray-200);background:var(--white);
                  transition:all .15s ease;
                ">
                  <div style="font-size:1.5rem;margin-bottom:8px">${s.icon}</div>
                  <div style="font-size:.8rem;font-weight:600;color:var(--gray-800)">${s.value}</div>
                  <div style="font-size:.7rem;color:var(--gray-400);margin-top:4px;line-height:1.3">${s.desc}</div>
                </div>`
                )
                .join("")}
            </div>
            <input type="hidden" id="service-type-val" />

            <div class="form-group">
              <label for="service-notes">Additional Notes</label>
              <textarea id="service-notes" rows="3" placeholder="Any special requests or notes…"></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-full" id="book-btn">
              <span>Book Service</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </form>
        </div>
      </div>
    `;

    // Service type selection
    let selectedType = "";
    const typeCards = document.querySelectorAll(".service-type-card");
    typeCards.forEach((card) => {
      card.addEventListener("click", () => {
        typeCards.forEach((c) => { c.style.borderColor = "var(--gray-200)"; c.style.background = "var(--white)"; });
        card.style.borderColor = "var(--blue-500)";
        card.style.background = "var(--blue-25)";
        selectedType = card.dataset.type;
        document.getElementById("service-type-val").value = selectedType;
      });
    });

    // Submit
    document.getElementById("service-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!selectedType) { showToast("Please select a service type", "error"); return; }
      const btn = document.getElementById("book-btn");
      btn.disabled = true;
      btn.querySelector("span").textContent = "Booking…";

      try {
        await bookService({
          car_id: parseInt(document.getElementById("service-car").value),
          service_type: selectedType,
          notes: document.getElementById("service-notes").value.trim(),
        });
        showToast(`${selectedType} booked successfully!`, "success");
        navigateTo("history");
      } catch (err) {
        showToast(err.message, "error");
        btn.disabled = false;
        btn.querySelector("span").textContent = "Book Service";
      }
    });
  } catch (err) {
    document.getElementById("services-content").innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error</h3><p>${err.message}</p></div>`;
  }
}
