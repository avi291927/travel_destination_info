/* =============================================
   MANAGE-DESTINATIONS.JS – Admin CRUD for Destinations
   ============================================= */

let deleteTargetId = null;
let allAdminDests = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  allAdminDests = DataManager.getDestinations();
  renderTable(allAdminDests);
  setEl('tableCount', `${allAdminDests.length} destination${allAdminDests.length !== 1 ? 's' : ''}`);

  // Check if URL has edit param
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('edit');
  if (editId) {
    openEditModal(parseInt(editId));
  }
});

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ==================== RENDER TABLE ====================
function renderTable(destinations) {
  const tbody = document.getElementById('destManageBody');
  if (!tbody) return;

  if (!destinations.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fas fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px"></i>No destinations found</td></tr>`;
    return;
  }

  tbody.innerHTML = destinations.map(dest => `
    <tr>
      <td>
        <img src="${dest.image}" alt="${dest.name}" class="table-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200&q=60'" />
      </td>
      <td><strong>${dest.name}</strong></td>
      <td>${dest.country}</td>
      <td><span class="category-badge ${dest.category}">${dest.category}</span></td>
      <td>
        <div class="rating-cell">
          <i class="fas fa-star"></i> ${dest.rating}
        </div>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-edit" onclick="openEditModal(${dest.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn-delete" onclick="openDeleteModal(${dest.id}, '${dest.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ==================== SEARCH ====================
function adminSearchDestinations() {
  const search = document.getElementById('adminSearch').value.toLowerCase();
  const category = document.getElementById('adminCategoryFilter').value;

  const filtered = allAdminDests.filter(d => {
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search) ||
      d.country.toLowerCase().includes(search);
    const matchCat = !category || d.category === category;
    return matchSearch && matchCat;
  });

  renderTable(filtered);
  setEl('tableCount', `${filtered.length} destination${filtered.length !== 1 ? 's' : ''}`);
}

// ==================== ADD MODAL ====================
function openAddModal() {
  document.getElementById('destModalTitle').innerHTML = '<i class="fas fa-plus"></i> Add New Destination';
  document.getElementById('destId').value = '';
  document.getElementById('destForm').reset();
  document.getElementById('destSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Save Destination';
  document.getElementById('destModal').style.display = 'flex';
}

function closeDestModal() {
  document.getElementById('destModal').style.display = 'none';
}

// ==================== EDIT MODAL ====================
function openEditModal(destId) {
  const dest = DataManager.getDestinationById(destId);
  if (!dest) return;

  document.getElementById('destModalTitle').innerHTML = `<i class="fas fa-edit"></i> Edit: ${dest.name}`;
  document.getElementById('destId').value = dest.id;
  document.getElementById('destName').value = dest.name || '';
  document.getElementById('destCountry').value = dest.country || '';
  document.getElementById('destCategory').value = dest.category || '';
  document.getElementById('destRating').value = dest.rating || '';
  document.getElementById('destImage').value = dest.image || '';
  document.getElementById('destShortDesc').value = dest.shortDesc || '';
  document.getElementById('destDescription').value = dest.description || '';
  document.getElementById('destBestTime').value = dest.bestTime || '';
  document.getElementById('destTemp').value = dest.temperature || '';
  document.getElementById('destHighlights').value = (dest.highlights || []).join(', ');
  document.getElementById('destSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Destination';
  document.getElementById('destModal').style.display = 'flex';
}

// ==================== SAVE (Add/Edit) ====================
function saveDestination(e) {
  e.preventDefault();
  const id = document.getElementById('destId').value;
  const highlights = document.getElementById('destHighlights').value
    .split(',')
    .map(h => h.trim())
    .filter(h => h.length);

  const destData = {
    name: document.getElementById('destName').value.trim(),
    country: document.getElementById('destCountry').value.trim(),
    category: document.getElementById('destCategory').value,
    rating: parseFloat(document.getElementById('destRating').value),
    image: document.getElementById('destImage').value.trim(),
    shortDesc: document.getElementById('destShortDesc').value.trim(),
    description: document.getElementById('destDescription').value.trim(),
    bestTime: document.getElementById('destBestTime').value.trim(),
    temperature: document.getElementById('destTemp').value.trim(),
    highlights
  };

  if (id) {
    DataManager.updateDestination(parseInt(id), destData);
    showAdminAlert('Destination updated successfully!');
  } else {
    DataManager.addDestination(destData);
    showAdminAlert('New destination added successfully!');
  }

  closeDestModal();
  allAdminDests = DataManager.getDestinations();
  renderTable(allAdminDests);
  setEl('tableCount', `${allAdminDests.length} destination${allAdminDests.length !== 1 ? 's' : ''}`);
}

// ==================== DELETE ====================
function openDeleteModal(id, name) {
  deleteTargetId = id;
  const nameEl = document.getElementById('deleteDestName');
  if (nameEl) nameEl.textContent = name;
  document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById('deleteModal').style.display = 'none';
}

function confirmDelete() {
  if (!deleteTargetId) return;
  DataManager.deleteDestination(deleteTargetId);
  closeDeleteModal();
  allAdminDests = DataManager.getDestinations();
  renderTable(allAdminDests);
  setEl('tableCount', `${allAdminDests.length} destination${allAdminDests.length !== 1 ? 's' : ''}`);
  showAdminAlert('Destination deleted successfully.');
}

// ==================== ALERT ====================
function showAdminAlert(msg) {
  const el = document.getElementById('adminAlert');
  if (!el) return;
  el.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeDestModal();
    closeDeleteModal();
  }
});
