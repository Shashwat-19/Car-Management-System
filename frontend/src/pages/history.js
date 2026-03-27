// ═══════════════════════════════════════════════════════════════════════════
// Service History Page v2
// ═══════════════════════════════════════════════════════════════════════════

import { getAllServices } from "../api.js";
import { navigateTo } from "../main.js";

export async function renderHistory(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-text">
        <h1>Service History</h1>
        <p>Complete maintenance records for all vehicles</p>
      </div>
      <button class="btn btn-primary" id="btn-new-service">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10m-5-5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span>New Service</span>
      </button>
    </div>
    <div id="history-content"><div class="spinner"></div></div>
  `;

  document.getElementById("btn-new-service").onclick = () => navigateTo("services");

  try {
    const services = await getAllServices();

    if (!services.length) {
      document.getElementById("history-content").innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>No service records yet</h3>
          <p>Book your first service to start tracking maintenance history.</p>
          <button class="btn btn-primary" id="empty-book">Book a Service</button>
        </div>`;
      document.getElementById("empty-book")?.addEventListener("click", () => navigateTo("services"));
      return;
    }

    const serviceBadges = { "Car Wash": "badge-wash", "Car Paint": "badge-paint", "Oil Change": "badge-oil" };

    document.getElementById("history-content").innerHTML = `
      <div class="table-container">
        <div class="table-header">
          <h3>All Services · ${services.length} records</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Vehicle</th>
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
                <td><span class="badge ${serviceBadges[s.service_type] || "badge-wash"}">${s.service_type}</span></td>
                <td style="color:var(--gray-900);font-weight:600">${s.car_number || "—"}</td>
                <td>${s.car_model || "—"}</td>
                <td>${new Date(s.serviced_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.notes || "—"}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    document.getElementById("history-content").innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error</h3><p>${err.message}</p></div>`;
  }
}
