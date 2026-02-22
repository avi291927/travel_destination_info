/* =============================================
   FAVORITES.JS – Favorites Page
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadFavoritesPage();
});

function loadFavoritesPage() {
  const user = getCurrentUser();
  const freshUser = DataManager.getUserByEmail(user.email);
  if (!freshUser) { logoutUser(); return; }

  const fullName = `${freshUser.firstName} ${freshUser.lastName}`;
  const avatarEl = document.getElementById('sidebarAvatar');
  const usernameEl = document.getElementById('sidebarUsername');
  if (avatarEl) avatarEl.textContent = freshUser.firstName[0].toUpperCase();
  if (usernameEl) usernameEl.textContent = fullName;

  const favoriteIds = freshUser.favorites || [];
  const countEl = document.getElementById('favTotalCount');
  if (countEl) countEl.textContent = favoriteIds.length;

  const grid = document.getElementById('favoritesGrid');
  const noFav = document.getElementById('noFavorites');

  if (!favoriteIds.length) {
    if (grid) grid.innerHTML = '';
    if (noFav) noFav.style.display = 'block';
    return;
  }

  const favDests = DataManager.getDestinations().filter(d => favoriteIds.includes(d.id));

  if (!favDests.length) {
    if (noFav) noFav.style.display = 'block';
    return;
  }

  if (noFav) noFav.style.display = 'none';
  if (grid) grid.innerHTML = favDests.map(d => buildDestCardWithRemove(d)).join('');
}

function buildDestCardWithRemove(dest) {
  return `
    <div class="dest-card" id="fav-card-${dest.id}">
      <div class="dest-card-img-wrap">
        <img src="${dest.image}" alt="${dest.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80'" />
        <span class="dest-card-category">${dest.category}</span>
        <button class="dest-card-fav active" onclick="removeFavAndRefresh(${dest.id})" title="Remove from favorites">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="dest-card-body">
        <div class="dest-card-rating">
          <span class="stars">${renderStars(dest.rating)}</span>
          <span class="rating-num">${dest.rating}</span>
        </div>
        <h3>${dest.name}</h3>
        <div class="dest-card-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${dest.country}</span>
        </div>
        <p class="dest-card-desc">${dest.shortDesc}</p>
        <div class="dest-card-actions">
          <a href="destination-detail.html?id=${dest.id}" class="btn-view-details">View Details</a>
          <button onclick="removeFavAndRefresh(${dest.id})" style="padding:10px 14px;background:#fef2f2;color:#dc2626;border-radius:10px;font-weight:600;font-size:.82rem;border:none;cursor:pointer;transition:all .25s;font-family:inherit" title="Remove">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function removeFavAndRefresh(destId) {
  toggleFavorite(destId);
  loadFavoritesPage();
}
