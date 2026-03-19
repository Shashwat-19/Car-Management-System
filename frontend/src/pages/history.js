// ═══════════════════════════════════════════════════════════════════════════
// Service History Page
// ═══════════════════════════════════════════════════════════════════════════

import { getAllServices } from "../api.js";

export async function renderHistory(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>Service History</h1>
      <p>Complete record of all past services</p>
    </div>
    <div id="history-content"><div class="spinner"></div></div>
  `;

  try {
    const services = await getAllServices();

    if (!services.length) {
      document.getElementById("history-content").innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>No services yet</h3>
          <p>Book your first service to see the history here.</p>
        </div>`;
      return;
    }

    const serviceIcons = { "Car Wash": "🚿", "Car Paint": "🎨", "Oil Change": "🛢️" };
    const serviceBadges = { "Car Wash": "badge-wash", "Car Paint": "badge-paint", "Oil Change": "badge-oil" };

    document.getElementById("history-content").innerHTML = `
      <div class="table-container">
        <div class="table-header">
          <h3>All Services (${services.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Car</th>
              <th>Model</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${services
              .map(
                (s) => `
              <tr>
                <td><span class="badge ${serviceBadges[s.service_type] || "badge-wash"}">${serviceIcons[s.service_type] || "🔧"} ${s.service_type}</span></td>
                <td style="color:var(--text-primary);font-weight:500;">${s.car_number || "—"}</td>
                <td>${s.car_model || "—"}</td>
                <td>${new Date(s.serviced_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td>${s.notes || "—"}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    document.getElementById("history-content").innerHTML = `<p style="color:var(--accent-danger);">${err.message}</p>`;
  }
}
