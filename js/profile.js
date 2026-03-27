/* =============================================
   PROFILE.JS – User Profile Page
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  initProfilePage();
});

function initProfilePage() {
  const user = getCurrentUser();
  const freshUser = DataManager.getUserByEmail(user.email);
  if (!freshUser) { logoutUser(); return; }

  const fullName = `${freshUser.firstName} ${freshUser.lastName}`;

  // Sidebar
  const avatarEl = document.getElementById('sidebarAvatar');
  const usernameEl = document.getElementById('sidebarUsername');
  if (avatarEl) avatarEl.textContent = freshUser.firstName[0].toUpperCase();
  if (usernameEl) usernameEl.textContent = fullName;

  // Profile card
  document.getElementById('profileAvatarLarge').textContent = freshUser.firstName[0].toUpperCase();
  document.getElementById('profileFullName').textContent = fullName;
  document.getElementById('profileEmail').textContent = freshUser.email;
  document.getElementById('profileSince').textContent = `Member since ${freshUser.joinDate || '2024'}`;
  document.getElementById('profileFavCount').textContent = (freshUser.favorites || []).length;

  // Populate form
  document.getElementById('editFirstName').value = freshUser.firstName || '';
  document.getElementById('editLastName').value = freshUser.lastName || '';
  document.getElementById('editEmail').value = freshUser.email || '';
  document.getElementById('editBio').value = freshUser.bio || '';
  document.getElementById('editTravelStyle').value = freshUser.travelStyle || '';
}

function saveProfile(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const firstName = document.getElementById('editFirstName').value.trim();
  const lastName = document.getElementById('editLastName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const bio = document.getElementById('editBio').value.trim();
  const travelStyle = document.getElementById('editTravelStyle').value;

  const errEl = document.getElementById('profileError');
  const succEl = document.getElementById('profileSuccess');
  hideEl(errEl); hideEl(succEl);

  // Check if email changed and conflicts
  if (email !== user.email) {
    const existing = DataManager.getUserByEmail(email);
    if (existing) {
      showEl(errEl, 'This email is already in use by another account.');
      return;
    }
  }

  const updated = DataManager.updateUser(user.email, { firstName, lastName, email, bio, travelStyle });
  if (updated) {
    setCurrentUser(updated);
    showEl(succEl, '<i class="fas fa-check-circle"></i> Profile updated successfully!');
    // Refresh UI
    document.getElementById('profileFullName').textContent = `${firstName} ${lastName}`;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileAvatarLarge').textContent = firstName[0].toUpperCase();
    document.getElementById('sidebarAvatar').textContent = firstName[0].toUpperCase();
    document.getElementById('sidebarUsername').textContent = `${firstName} ${lastName}`;
    showToast('Profile saved successfully!', 'success');
  }
}

function changePassword(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const freshUser = DataManager.getUserByEmail(user.email);
  const currentPw = document.getElementById('currentPw').value;
  const newPw = document.getElementById('newPw').value;
  const confirmNewPw = document.getElementById('confirmNewPw').value;

  const errEl = document.getElementById('pwError');
  const succEl = document.getElementById('pwSuccess');
  hideEl(errEl); hideEl(succEl);

  if (freshUser.password !== currentPw) {
    showEl(errEl, 'Current password is incorrect.');
    return;
  }
  if (newPw !== confirmNewPw) {
    showEl(errEl, 'New passwords do not match.');
    return;
  }
  if (newPw.length < 6) {
    showEl(errEl, 'Password must be at least 6 characters.');
    return;
  }

  DataManager.updateUser(user.email, { password: newPw });
  showEl(succEl, '<i class="fas fa-check-circle"></i> Password changed successfully!');
  document.getElementById('passwordForm').reset();
  showToast('Password updated!', 'success');
}
