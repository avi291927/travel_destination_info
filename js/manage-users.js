/* =============================================
   MANAGE-USERS.JS – Admin Users Management
   ============================================= */

let allUsers = [];
let deleteTargetEmail = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAdmin()) return;
  loadUsersTable();
});

function loadUsersTable() {
  allUsers = DataManager.getUsers();

  // Add demo user if none exist
  if (!allUsers.length) {
    DataManager.addUser({
      firstName: 'Demo',
      lastName: 'Traveler',
      email: 'demo@wanderworld.com',
      password: 'demo1234',
      favorites: [1, 2, 3]
    });
    allUsers = DataManager.getUsers();
  }

  renderUsersTable(allUsers);
  setEl('userTableCount', `${allUsers.length} user${allUsers.length !== 1 ? 's' : ''}`);
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted)">No users found</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>
        <div class="user-table-avatar">${user.firstName ? user.firstName[0].toUpperCase() : 'U'}</div>
      </td>
      <td><strong>${user.firstName || ''} ${user.lastName || ''}</strong></td>
      <td>${user.email}</td>
      <td><span class="role-badge ${user.role || 'user'}">${user.role || 'user'}</span></td>
      <td>${(user.favorites || []).length} saved</td>
      <td>${user.joinDate || 'N/A'}</td>
      <td>
        <div class="table-actions">
          <button class="btn-delete" onclick="openDeleteUserModal('${user.email.replace(/'/g, "\\'")}', '${(user.firstName + ' ' + user.lastName).replace(/'/g, "\\'")}')">
            <i class="fas fa-user-times"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function searchUsers() {
  const search = document.getElementById('userSearch').value.toLowerCase();
  const filtered = allUsers.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search) ||
    u.email.toLowerCase().includes(search)
  );
  renderUsersTable(filtered);
  setEl('userTableCount', `${filtered.length} user${filtered.length !== 1 ? 's' : ''}`);
}

function openDeleteUserModal(email, name) {
  deleteTargetEmail = email;
  const nameEl = document.getElementById('deleteUserName');
  if (nameEl) nameEl.textContent = name;
  document.getElementById('deleteUserModal').style.display = 'flex';
}

function closeDeleteUserModal() {
  deleteTargetEmail = null;
  document.getElementById('deleteUserModal').style.display = 'none';
}

function confirmDeleteUser() {
  if (!deleteTargetEmail) return;
  DataManager.deleteUser(deleteTargetEmail);
  closeDeleteUserModal();
  loadUsersTable();

  const alertEl = document.getElementById('userAlert');
  if (alertEl) {
    alertEl.innerHTML = '<i class="fas fa-check-circle"></i> User deleted successfully.';
    alertEl.style.display = 'flex';
    setTimeout(() => { alertEl.style.display = 'none'; }, 4000);
  }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeDeleteUserModal();
  }
});
