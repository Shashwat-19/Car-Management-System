// ═══════════════════════════════════════════════════════════════════════════
// Dashboard Page v2 — Hero banner, animated stats, rich layout
// ═══════════════════════════════════════════════════════════════════════════

import { listCars, getAllServices } from "../api.js";
import { navigateTo } from "../main.js";

export async function renderDashboard(container) {
  container.innerHTML = `
    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-text">
        <h2>Welcome to Car Management System</h2>
        <p>Your complete vehicle management dashboard. Track your fleet, schedule services, and keep everything running smoothly.</p>
      </div>
      <img src="/hero-service.png" alt="Car Service" class="hero-img" />
    </div>

    <!-- Stats -->
    <div class="stats-grid" id="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 15h16l-2-6H5l-2 6zm3-8h10l1 3H5l1-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="7" cy="16.5" r="1.5" stroke="currentColor" stroke-width="1.3"/><circle cx="15" cy="16.5" r="1.5" stroke="currentColor" stroke-width="1.3"/></svg>
        </div>
        <div>
          <div class="stat-value" id="stat-cars">—</div>
          <div class="stat-label">Total Vehicles</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon cyan">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M11 2v2m0 14v2m-9-9h2m14 0h2m-3.1-6.9-1.4 1.4m-8.6 8.6L3.5 18.5m0-15 1.4 1.4m8.6 8.6 1.4 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div>
          <div class="stat-value" id="stat-services">—</div>
          <div class="stat-label">Total Services</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 9h16M7 2v4m8-4v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div>
          <div class="stat-value" id="stat-recent">—</div>
          <div class="stat-label">This Month</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon amber">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l2.5 5.5L19 8.5l-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-1L11 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
        </div>
        <div>
          <div class="stat-value" id="stat-top">—</div>
          <div class="stat-label">Top Service</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <h3 class="section-title">Quick Actions</h3>
    <div class="action-grid">
      <div class="action-card" id="action-add-car">
        <div class="action-card-icon">🚘</div>
        <h4>Register Car</h4>
        <p>Add a new vehicle to your fleet</p>
      </div>
      <div class="action-card" id="action-book-service">
        <div class="action-card-icon">🔧</div>
        <h4>Book Service</h4>
        <p>Schedule maintenance now</p>
      </div>
      <div class="action-card" id="action-view-history">
        <div class="action-card-icon">📋</div>
        <h4>Service History</h4>
        <p>View past maintenance records</p>
      </div>
      <div class="action-card" id="action-view-cars">
        <div class="action-card-icon">📊</div>
        <h4>Fleet Overview</h4>
        <p>See all your registered cars</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <h3 class="section-title" id="recent-title" style="display:none">Recent Activity</h3>
    <div class="service-list" id="recent-services"></div>
  `;

  // Quick-action clicks
  document.getElementById("action-add-car").onclick = () => navigateTo("cars");
  document.getElementById("action-book-service").onclick = () => navigateTo("services");
  document.getElementById("action-view-history").onclick = () => navigateTo("history");
  document.getElementById("action-view-cars").onclick = () => navigateTo("cars");

  // Load data
  try {
    const [cars, services] = await Promise.all([listCars(), getAllServices()]);

    // Animate stat counters
    animateCounter("stat-cars", cars.length);
    animateCounter("stat-services", services.length);

    const now = new Date();
    const thisMonth = services.filter((s) => {
      const d = new Date(s.serviced_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    animateCounter("stat-recent", thisMonth.length);

    if (services.length) {
      const freq = {};
      services.forEach((s) => (freq[s.service_type] = (freq[s.service_type] || 0) + 1));
      const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      document.getElementById("stat-top").textContent = top[0];
    } else {
      document.getElementById("stat-top").textContent = "N/A";
    }

    // Recent services
    if (services.length) {
      document.getElementById("recent-title").style.display = "";
      const recent = services.slice(0, 5);
      const serviceIcons = { "Car Wash": "🚿", "Car Paint": "🎨", "Oil Change": "🛢️" };
      const serviceBadges = { "Car Wash": "badge-wash", "Car Paint": "badge-paint", "Oil Change": "badge-oil" };
      document.getElementById("recent-services").innerHTML = recent
        .map(
          (s) => `
        <div class="service-item">
          <div class="service-item-icon" style="background:${s.service_type === 'Car Wash' ? 'var(--blue-50)' : s.service_type === 'Car Paint' ? 'var(--violet-50)' : 'var(--amber-50)'}">${serviceIcons[s.service_type] || "🔧"}</div>
          <div class="service-item-info">
            <div class="service-item-type">${s.service_type}</div>
            <div class="service-item-meta">${s.car_number || ""} ${s.car_model || ""} · ${new Date(s.serviced_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
          <span class="badge ${serviceBadges[s.service_type] || "badge-wash"}">${s.service_type}</span>
        </div>`
        )
        .join("");
    }
  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

// Animated counter helper
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  if (target === 0) { el.textContent = "0"; return; }
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = current;
  }, 30);
}
