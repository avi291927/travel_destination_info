// Auth system

const ADMIN_CREDENTIALS = { email: 'admin@gmail.com', password: 'admin' };
const SESSION_KEY = 'ww_session';
const ADMIN_SESSION_KEY = 'ww_admin_session';

// Image helper function
function getImageUrl(img) {
  if (!img) return '';
  if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/') || img.startsWith('../')) return img;
  if (window.location.pathname.includes('/pages/')) return '../' + img;
  return img;
}


// Session helpers
function getCurrentUser() {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function isAdmin() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

// Navbar state
function updateNavbar() {
  const user = getCurrentUser();
  const navUserLinks = document.getElementById('nav-user-links');
  const navLogout = document.getElementById('nav-logout');
  const navAuthLinks = document.getElementById('nav-auth-links');
  const navAuthLinks2 = document.getElementById('nav-auth-links2');

  if (user) {
    if (navUserLinks) navUserLinks.style.display = 'block';
    if (navLogout) navLogout.style.display = 'block';
    if (navAuthLinks) navAuthLinks.style.display = 'none';
    if (navAuthLinks2) navAuthLinks2.style.display = 'none';
  } else {
    if (navUserLinks) navUserLinks.style.display = 'none';
    if (navLogout) navLogout.style.display = 'none';
    if (navAuthLinks) navAuthLinks.style.display = 'block';
    if (navAuthLinks2) navAuthLinks2.style.display = 'block';
  }
}

// Login
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Signing in...';

  setTimeout(() => {
    // Check admin credentials first
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      hideEl(errEl);
      showSuccessMsg('loginSuccess', 'Admin login successful! Redirecting to Admin Portal...');
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 1000);
      return;
    }

    const user = DataManager.getUserByEmail(email);
    if (!user || user.password !== password) {
      showEl(errEl, 'Invalid email or password. Please try again.');
      btn.disabled = false;
      btn.innerHTML = '<span>Sign In</span> <i class="fas fa-arrow-right"></i>';
      return;
    }
    hideEl(errEl);
    setCurrentUser(user);
    showSuccessMsg('loginSuccess', 'Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = 'user-dashboard.html';
    }, 1000);
  }, 700);
}


// Register
function handleRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('regFirstName').value.trim();
  const lastName = document.getElementById('regLastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirmPassword').value;
  const errEl = document.getElementById('registerError');
  const btn = document.getElementById('registerBtn');

  if (password !== confirm) {
    showEl(errEl, 'Passwords do not match.');
    return;
  }
  if (DataManager.getUserByEmail(email)) {
    showEl(errEl, 'An account with this email already exists.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating account...';

  setTimeout(() => {
    const user = DataManager.addUser({ firstName, lastName, email, password });
    setCurrentUser(user);
    hideEl(errEl);
    showSuccessMsg('registerSuccess', 'Account created! Redirecting...');
    setTimeout(() => {
      window.location.href = 'user-dashboard.html';
    }, 1200);
  }, 700);
}

// Admin login
function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  const errEl = document.getElementById('adminLoginError');

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    hideEl(errEl);
    window.location.href = 'admin-dashboard.html';
  } else {
    showEl(errEl, '<i class="fas fa-exclamation-circle"></i> Invalid admin credentials.');
  }
}

// Logout
function logoutUser() {
  clearSession();
  const path = window.location.pathname;
  if (path.includes('/pages/')) {
    window.location.href = '../index.html';
  } else {
    window.location.href = 'index.html';
  }
}

function adminLogout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = '../index.html';
}

// Route guards
function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// Password helpers
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function checkPasswordStrength(val) {
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');
  if (!fill) return;
  let strength = 0;
  if (val.length >= 6) strength++;
  if (val.length >= 10) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  const levels = [
    { pct: '20%', color: '#ef4444', label: 'Very weak' },
    { pct: '40%', color: '#f97316', label: 'Weak' },
    { pct: '60%', color: '#eab308', label: 'Fair' },
    { pct: '80%', color: '#22c55e', label: 'Good' },
    { pct: '100%', color: '#15803d', label: 'Strong' }
  ];
  const lvl = levels[Math.max(0, strength - 1)] || levels[0];
  fill.style.width = lvl.pct;
  fill.style.background = lvl.color;
  text.textContent = val.length === 0 ? 'Enter password' : lvl.label;
  text.style.color = lvl.color;
}

// DOM helpers
function showEl(el, msg) {
  if (!el) return;
  el.innerHTML = msg;
  el.style.display = 'flex';
}

function hideEl(el) {
  if (!el) return;
  el.style.display = 'none';
}

function showSuccessMsg(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'flex'; }
}

// Favorites
function getUserFavorites() {
  const user = getCurrentUser();
  if (!user) return [];
  const freshUser = DataManager.getUserByEmail(user.email);
  return freshUser ? (freshUser.favorites || []) : [];
}

function toggleFavorite(destId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login to save favorites', 'info');
    return false;
  }
  const freshUser = DataManager.getUserByEmail(user.email);
  if (!freshUser) return false;
  let favorites = freshUser.favorites || [];
  const isFav = favorites.includes(destId);
  if (isFav) {
    favorites = favorites.filter(id => id !== destId);
    showToast('Removed from favorites', 'info');
  } else {
    favorites.push(destId);
    showToast('Added to favorites!', 'success');
  }
  const updated = DataManager.updateUser(user.email, { favorites });
  setCurrentUser(updated);
  return !isFav;
}

function isFavorite(destId) {
  return getUserFavorites().includes(destId);
}

// Toast notifications
function showToast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${msg}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  });
}

// Dark mode
function initDarkMode() {
  const isDark = localStorage.getItem('ww_darkmode') === 'true';
  if (isDark) document.body.classList.add('dark-mode');

  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const nowDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('ww_darkmode', nowDark);
      toggle.querySelector('i').className = nowDark ? 'fas fa-sun' : 'fas fa-moon';
    });
  }
}

// Sidebar toggle
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const close = document.getElementById('sidebarClose');
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Create overlay
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const open = () => { sidebar.classList.add('open'); overlay.classList.add('show'); };
  const closeSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); };

  if (toggle) toggle.addEventListener('click', open);
  if (close) close.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
}

// Stars render
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) stars += '<i class="fas fa-star-half-alt"></i>';
    else stars += '<i class="far fa-star"></i>';
  }
  return stars;
}

// Card builder
function buildDestCard(dest, linkPrefix = '') {
  const fav = isFavorite(dest.id);
  // Resolve image path
  let imgSrc = getImageUrl(dest.image);
  return `
    <div class="dest-card" data-id="${dest.id}">
      <div class="dest-card-img-wrap">
        <img src="${imgSrc}" alt="${dest.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80'"/>
        <span class="dest-card-category">${dest.category}</span>
        <button class="dest-card-fav ${fav ? 'active' : ''}" onclick="handleFavClick(${dest.id}, this)" title="${fav ? 'Remove from favorites' : 'Save to favorites'}">
          <i class="${fav ? 'fas' : 'far'} fa-heart"></i>
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
          <a href="${linkPrefix}destination-detail.html?id=${dest.id}" class="btn-view-details">View Details</a>
        </div>
      </div>
    </div>
  `;
}

function handleFavClick(destId, btn) {
  const added = toggleFavorite(destId);
  if (added === false) return; // not logged in
  btn.classList.toggle('active', added);
  const icon = btn.querySelector('i');
  icon.className = added ? 'fas fa-heart' : 'far fa-heart';
}

// Hamburger menu
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Scroll navbar
function initScrollNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // On pages without a hero (sub-pages), always show scrolled navbar
  const hasHero = document.querySelector('.hero');
  if (!hasHero) {
    navbar.classList.add('scrolled');
    return;
  }

  const handler = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

// Tab switch
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('tab-' + tabId);
  if (tab) tab.classList.add('active');
  event.target.classList.add('active');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initSidebar();
  initHamburger();
  initScrollNavbar();
  updateNavbar();
});
