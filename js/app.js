/* =============================================
   APP.JS – Homepage Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedDestinations();
  initHeroSearch();
  initCategoryParamListener();
});

function loadFeaturedDestinations() {
  const grid = document.getElementById('featuredDestinations');
  if (!grid) return;

  const featured = DataManager.getFeatured();
  if (!featured.length) {
    grid.innerHTML = '<p class="text-center" style="color:var(--text-muted);">No featured destinations yet.</p>';
    return;
  }

  grid.innerHTML = featured.map(d => buildDestCard(d, 'pages/')).join('');
}

function heroSearchDestination() {
  const val = document.getElementById('heroSearch').value.trim();
  if (val) {
    window.location.href = `pages/destinations.html?q=${encodeURIComponent(val)}`;
  } else {
    window.location.href = 'pages/destinations.html';
  }
}

function initHeroSearch() {
  const input = document.getElementById('heroSearch');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') heroSearchDestination();
  });
}

function initCategoryParamListener() {
  // Not needed on index but keeps structure consistent
}
