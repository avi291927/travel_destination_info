/* =============================================
   ADMIN.JS – Admin Dashboard Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  initAdminDashboard();
});

function initAdminDashboard() {
  const destinations = DataManager.getDestinations();
  const users = DataManager.getUsers();

  // Date display
  const dateEl = document.getElementById('adminDate');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Stats
  const countries = [...new Set(destinations.map(d => d.country))].length;
  const avgRating = destinations.length ? (destinations.reduce((s, d) => s + d.rating, 0) / destinations.length).toFixed(1) : '0';

  setEl('totalDestinations', destinations.length);
  setEl('totalUsers', users.length);
  setEl('totalCountries', countries);
  setEl('avgRating', avgRating);

  // Category chart
  renderCategoryChart(destinations);

  // Recent destinations table (last 8)
  renderRecentTable(destinations.slice(-8).reverse());
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderCategoryChart(destinations) {
  const container = document.getElementById('categoryChart');
  if (!container) return;

  const catMap = {};
  destinations.forEach(d => {
    catMap[d.category] = (catMap[d.category] || 0) + 1;
  });

  const colors = {
    beach: '#10b981',
    mountain: '#3b82f6',
    city: '#6b7280',
    cultural: '#f59e0b',
    adventure: '#ef4444',
    nature: '#22c55e'
  };

  const total = destinations.length || 1;
  const html = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `
      <div class="chart-bar-item">
        <div class="chart-bar-label">
          <span>${cat}</span>
          <span>${count} (${Math.round(count / total * 100)}%)</span>
        </div>
        <div class="chart-bar-wrap">
          <div class="chart-bar-fill" style="width:${count / total * 100}%;background:${colors[cat] || '#2563eb'}"></div>
        </div>
      </div>
    `).join('');

  container.innerHTML = html;
}

function renderRecentTable(destinations) {
  const tbody = document.getElementById('recentDestBody');
  if (!tbody) return;
  tbody.innerHTML = destinations.map(dest => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${dest.image}" alt="${dest.name}" class="table-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200&q=60'" />
          <strong>${dest.name}</strong>
        </div>
      </td>
      <td>${dest.country}</td>
      <td><span class="category-badge ${dest.category}">${dest.category}</span></td>
      <td>
        <div class="rating-cell">
          <i class="fas fa-star"></i> ${dest.rating}
        </div>
      </td>
      <td>
        <div class="table-actions">
          <a href="manage-destinations.html?edit=${dest.id}" class="btn-edit"><i class="fas fa-edit"></i> Edit</a>
        </div>
      </td>
    </tr>
  `).join('');
}

function closeModal() {
  const modal = document.getElementById('editModal');
  if (modal) modal.style.display = 'none';
}

function adminLogoutPage() {
  adminLogout();
}
