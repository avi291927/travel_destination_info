/* =============================================
   USER-PORTAL.JS – User Dashboard
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initDashboard();
});

function initDashboard() {
  const user = getCurrentUser();
  const freshUser = DataManager.getUserByEmail(user.email);
  if (!freshUser) { logoutUser(); return; }

  // Welcome message
  const welcomeEl = document.getElementById('welcomeMsg');
  const fullName = `${freshUser.firstName} ${freshUser.lastName}`;
  if (welcomeEl) welcomeEl.textContent = `Welcome back, ${freshUser.firstName}!`;

  // Sidebar user info
  const avatarEl = document.getElementById('sidebarAvatar');
  const usernameEl = document.getElementById('sidebarUsername');
  if (avatarEl) avatarEl.textContent = freshUser.firstName[0].toUpperCase();
  if (usernameEl) usernameEl.textContent = fullName;

  // Favorites count
  const favCount = (freshUser.favorites || []).length;
  const favCountEl = document.getElementById('favCount');
  if (favCountEl) favCountEl.textContent = favCount;

  // Load saved destinations (up to 4)
  loadSavedDestinations(freshUser.favorites || []);

  // Load recommended (top rated, not in favorites)
  loadRecommended(freshUser.favorites || []);
}

function loadSavedDestinations(favoriteIds) {
  const grid = document.getElementById('savedDestinations');
  const noSaved = document.getElementById('noSaved');
  if (!grid) return;

  if (!favoriteIds.length) {
    grid.style.display = 'none';
    if (noSaved) noSaved.style.display = 'block';
    return;
  }

  const destinations = DataManager.getDestinations().filter(d => favoriteIds.includes(d.id)).slice(0, 4);
  if (!destinations.length) {
    grid.style.display = 'none';
    if (noSaved) noSaved.style.display = 'block';
    return;
  }

  if (noSaved) noSaved.style.display = 'none';
  grid.style.display = 'grid';
  grid.innerHTML = destinations.map(d => buildDestCard(d, '')).join('');
}

function loadRecommended(favoriteIds) {
  const grid = document.getElementById('recommendedDestinations');
  if (!grid) return;

  const allDests = DataManager.getDestinations();
  const recommended = allDests
    .filter(d => !favoriteIds.includes(d.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  grid.innerHTML = recommended.map(d => buildDestCard(d, '')).join('');
}
