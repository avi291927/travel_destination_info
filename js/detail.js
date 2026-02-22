/* =============================================
   DETAIL.JS – Destination Detail Page
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) {
    renderError();
    return;
  }
  const dest = DataManager.getDestinationById(id);
  if (!dest) {
    renderError();
    return;
  }
  renderDetail(dest);
});

function renderDetail(dest) {
  document.title = `${dest.name} – WanderWorld`;
  const fav = isFavorite(dest.id);
  const highlights = dest.highlights || [];
  const highlightsHTML = highlights.map(h => `
    <div class="highlight-item">
      <i class="fas fa-check-circle"></i>
      <span>${h}</span>
    </div>
  `).join('');

  const html = `
    <div class="detail-hero" style="background-image:url('${dest.image}')">
      <div class="detail-hero-overlay"></div>
      <div class="detail-hero-content">
        <div class="detail-breadcrumb">
          <a href="../index.html">Home</a> &rsaquo;
          <a href="destinations.html">Destinations</a> &rsaquo;
          ${dest.name}
        </div>
        <h1>${dest.name}</h1>
        <div class="detail-meta">
          <div class="detail-meta-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${dest.country}</span>
          </div>
          <div class="detail-meta-item">
            <i class="fas fa-tag"></i>
            <span style="text-transform:capitalize">${dest.category}</span>
          </div>
          <div class="detail-rating-badge">
            <i class="fas fa-star"></i>
            <span>${dest.rating} / 5</span>
          </div>
        </div>
      </div>
    </div>

    <section class="detail-content">
      <div class="container">
        <div class="detail-grid">
          <div class="detail-main">
            <h2><i class="fas fa-info-circle"></i> About ${dest.name}</h2>
            <p>${dest.description}</p>

            ${highlights.length ? `
              <h2><i class="fas fa-star"></i> Top Highlights</h2>
              <div class="highlights-grid">${highlightsHTML}</div>
            ` : ''}

            <h2><i class="fas fa-compass"></i> More Destinations</h2>
            <div class="destination-grid" id="relatedDestinations"></div>
          </div>

          <div class="detail-sidebar">
            <div class="detail-info-card">
              <h3><i class="fas fa-info-circle"></i> Quick Info</h3>
              <div class="info-row">
                <div class="info-row-icon"><i class="fas fa-globe"></i></div>
                <div class="info-row-text">
                  <span>Country</span>
                  <span>${dest.country}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-row-icon"><i class="fas fa-tag"></i></div>
                <div class="info-row-text">
                  <span>Category</span>
                  <span style="text-transform:capitalize">${dest.category}</span>
                </div>
              </div>
              ${dest.bestTime ? `
                <div class="info-row">
                  <div class="info-row-icon"><i class="fas fa-calendar-alt"></i></div>
                  <div class="info-row-text">
                    <span>Best Time to Visit</span>
                    <span>${dest.bestTime}</span>
                  </div>
                </div>
              ` : ''}
              ${dest.temperature ? `
                <div class="info-row">
                  <div class="info-row-icon"><i class="fas fa-thermometer-half"></i></div>
                  <div class="info-row-text">
                    <span>Temperature</span>
                    <span>${dest.temperature}</span>
                  </div>
                </div>
              ` : ''}
              <div class="info-row">
                <div class="info-row-icon"><i class="fas fa-star"></i></div>
                <div class="info-row-text">
                  <span>Rating</span>
                  <span>${dest.rating} / 5.0</span>
                </div>
              </div>
            </div>

            <div class="detail-info-card">
              <h3><i class="fas fa-heart"></i> Save This Destination</h3>
              <div class="detail-actions">
                <button class="btn-fav-detail ${fav ? 'active' : ''}" id="detailFavBtn" onclick="handleDetailFav(${dest.id})">
                  <i class="${fav ? 'fas' : 'far'} fa-heart"></i>
                  ${fav ? 'Saved to Favorites' : 'Save to Favorites'}
                </button>
                <a href="destinations.html" class="btn-primary" style="justify-content:center">
                  <i class="fas fa-compass"></i> Browse More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('detailContent').innerHTML = html;
  loadRelated(dest);
}

function handleDetailFav(destId) {
  const added = toggleFavorite(destId);
  if (added === false) return;
  const btn = document.getElementById('detailFavBtn');
  if (!btn) return;
  btn.classList.toggle('active', added);
  const icon = btn.querySelector('i');
  icon.className = added ? 'fas fa-heart' : 'far fa-heart';
  btn.innerHTML = `<i class="${added ? 'fas' : 'far'} fa-heart"></i> ${added ? 'Saved to Favorites' : 'Save to Favorites'}`;
}

function loadRelated(dest) {
  const related = DataManager.getDestinations()
    .filter(d => d.id !== dest.id && (d.category === dest.category || d.country === dest.country))
    .slice(0, 3);
  const grid = document.getElementById('relatedDestinations');
  if (!grid) return;
  if (!related.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);font-size:.88rem;">No related destinations found.</p>';
    return;
  }
  grid.innerHTML = related.map(d => buildDestCard(d, '')).join('');
}

function renderError() {
  document.getElementById('detailContent').innerHTML = `
    <div style="text-align:center;padding:120px 24px;padding-top:calc(var(--navbar-h) + 80px)">
      <i class="fas fa-map-marked-alt" style="font-size:4rem;color:var(--text-muted);margin-bottom:20px;display:block"></i>
      <h2 style="color:var(--text-primary);margin-bottom:10px">Destination Not Found</h2>
      <p style="color:var(--text-muted);margin-bottom:24px">The destination you're looking for doesn't exist.</p>
      <a href="destinations.html" class="btn-primary">Browse All Destinations</a>
    </div>
  `;
}
