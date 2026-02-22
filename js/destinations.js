/* =============================================
   DESTINATIONS.JS – Destinations Listing Page
   ============================================= */

let allDestinations = [];

document.addEventListener('DOMContentLoaded', () => {
  allDestinations = DataManager.getDestinations();
  applyURLParams();
  filterDestinations();
});

function applyURLParams() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const cat = params.get('category');
  if (q) document.getElementById('searchInput').value = q;
  if (cat) document.getElementById('categoryFilter').value = cat;
}

function filterDestinations() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const category = document.getElementById('categoryFilter').value;
  const minRating = parseFloat(document.getElementById('ratingFilter').value) || 0;
  const sort = document.getElementById('sortFilter').value;

  let filtered = allDestinations.filter(d => {
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search) ||
      d.country.toLowerCase().includes(search) ||
      d.category.toLowerCase().includes(search) ||
      d.shortDesc.toLowerCase().includes(search);
    const matchCat = !category || d.category === category;
    const matchRating = d.rating >= minRating;
    return matchSearch && matchCat && matchRating;
  });

  // Sort
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'country') filtered.sort((a, b) => a.country.localeCompare(b.country));

  renderGrid(filtered);
  document.getElementById('resultsInfo').textContent = `Showing ${filtered.length} destination${filtered.length !== 1 ? 's' : ''}`;
}

function renderGrid(destinations) {
  const grid = document.getElementById('destinationsGrid');
  const noResults = document.getElementById('noResults');

  if (!destinations.length) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';
  grid.innerHTML = destinations.map(d => buildDestCard(d, '')).join('');
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('ratingFilter').value = '';
  document.getElementById('sortFilter').value = 'default';
  filterDestinations();
}
