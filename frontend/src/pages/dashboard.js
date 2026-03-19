// ═══════════════════════════════════════════════════════════════════════════
// Dashboard Page
// ═══════════════════════════════════════════════════════════════════════════

import { listCars, getAllServices } from "../api.js";
import { navigateTo } from "../main.js";

export async function renderDashboard(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Overview of your vehicle fleet and recent activity</p>
    </div>
    <div class="stats-grid" id="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🚘</div>
        <div><div class="stat-value" id="stat-cars">—</div><div class="stat-label">Total Cars</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon cyan">🔧</div>
        <div><div class="stat-value" id="stat-services">—</div><div class="stat-label">Total Services</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div><div class="stat-value" id="stat-recent">—</div><div class="stat-label">This Month</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon amber">⭐</div>
        <div><div class="stat-value" id="stat-top">—</div><div class="stat-label">Top Service</div></div>
      </div>
    </div>
    <h3 class="section-title">Quick Actions</h3>
    <div class="action-grid">
      <div class="action-card" id="action-add-car">
        <div class="action-card-icon">➕</div>
        <h4>Register Car</h4>
        <p>Add a new vehicle</p>
      </div>
      <div class="action-card" id="action-book-service">
        <div class="action-card-icon">🔧</div>
        <h4>Book Service</h4>
        <p>Schedule maintenance</p>
      </div>
      <div class="action-card" id="action-view-history">
        <div class="action-card-icon">📋</div>
        <h4>View History</h4>
        <p>Past service records</p>
      </div>
    </div>
    <h3 class="section-title" id="recent-title" style="display:none">Recent Services</h3>
    <div class="service-list" id="recent-services"></div>
  `;

  // Quick-action clicks
  document.getElementById("action-add-car").onclick = () => navigateTo("cars");
  document.getElementById("action-book-service").onclick = () => navigateTo("services");
  document.getElementById("action-view-history").onclick = () => navigateTo("history");

  // Load data
  try {
    const [cars, services] = await Promise.all([listCars(), getAllServices()]);

    document.getElementById("stat-cars").textContent = cars.length;
    document.getElementById("stat-services").textContent = services.length;

    // This-month count
    const now = new Date();
    const thisMonth = services.filter((s) => {
      const d = new Date(s.serviced_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    document.getElementById("stat-recent").textContent = thisMonth.length;

    // Top service type
    if (services.length) {
      const freq = {};
      services.forEach((s) => (freq[s.service_type] = (freq[s.service_type] || 0) + 1));
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      document.getElementById("stat-top").textContent = top[0];
    } else {
      document.getElementById("stat-top").textContent = "N/A";
    }

    // Recent 5 services
    if (services.length) {
      document.getElementById("recent-title").style.display = "";
      const recent = services.slice(0, 5);
      const serviceIcons = { "Car Wash": "🚿", "Car Paint": "🎨", "Oil Change": "🛢️" };
      const serviceBadges = { "Car Wash": "badge-wash", "Car Paint": "badge-paint", "Oil Change": "badge-oil" };
      document.getElementById("recent-services").innerHTML = recent
        .map(
          (s) => `
        <div class="service-item">
          <div class="service-item-icon ${serviceBadges[s.service_type] || "badge-wash"}">${serviceIcons[s.service_type] || "🔧"}</div>
          <div class="service-item-info">
            <div class="service-item-type">${s.service_type}</div>
            <div class="service-item-meta">${s.car_number || ""} ${s.car_model || ""} · ${new Date(s.serviced_at).toLocaleDateString()}</div>
          </div>
          <span class="badge ${serviceBadges[s.service_type] || "badge-wash"}">${s.service_type}</span>
        </div>`
        )
        .join("");
    }
  } catch (err) {
    console.error("Dashboard data error:", err);
  }
}
