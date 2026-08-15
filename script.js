/* ══════════════════════════════════════════════════
   VITH EDUCATION LMS — Core Application Script
   Pure Vanilla JS | No dependencies
══════════════════════════════════════════════════ */

'use strict';

/* ── 1. MODULE DATA DEFINITIONS ─────────────────── */
const MODULES = [
  {
    id: 'mod-01',
    number: '01',
    title: 'Pengenalan HTML & Struktur Dokumen',
    desc: 'Pelajari fondasi web: apa itu HTML, struktur dokumen, elemen dasar, dan cara browser membaca kode Anda.',
    category: 'HTML Dasar',
    difficulty: 'beginner',
    stage: 1,
    duration: 45,
    path: 'modules/01-pengenalan-html/index.html',
  }
];

/* ── 2. STORAGE KEYS ────────────────────────────── */
const STORAGE_KEY_STATUS    = 'vith_lms_status';
const STORAGE_KEY_BOOKMARKS = 'vith_lms_bookmarks';

/* ── 3. STATE MANAGEMENT ────────────────────────── */
const State = {
  statuses:  {},   // { [moduleId]: 'not_started' | 'in_progress' | 'completed' }
  bookmarks: [],   // [moduleId, ...]
  filter: {
    query:      '',
    category:   'all',
    status:     'all',
    difficulty: 'all',
  },

  load() {
    try {
      const savedStatus    = localStorage.getItem(STORAGE_KEY_STATUS);
      const savedBookmarks = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (savedStatus)    this.statuses   = JSON.parse(savedStatus);
      if (savedBookmarks) this.bookmarks  = JSON.parse(savedBookmarks);
    } catch (e) {
      console.warn('[VITH LMS] Could not load state from localStorage:', e);
      this.statuses  = {};
      this.bookmarks = [];
    }
    // Ensure every module has a status
    MODULES.forEach(m => {
      if (!this.statuses[m.id]) this.statuses[m.id] = 'not_started';
    });
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY_STATUS,    JSON.stringify(this.statuses));
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(this.bookmarks));
    } catch (e) {
      console.warn('[VITH LMS] Could not save state:', e);
    }
  },

  reset() {
    this.statuses  = {};
    this.bookmarks = [];
    MODULES.forEach(m => { this.statuses[m.id] = 'not_started'; });
    this.save();
  },

  setStatus(id, status) {
    this.statuses[id] = status;
    this.save();
  },

  toggleBookmark(id) {
    const idx = this.bookmarks.indexOf(id);
    if (idx === -1) {
      this.bookmarks.push(id);
    } else {
      this.bookmarks.splice(idx, 1);
    }
    this.save();
    return this.bookmarks.includes(id);
  },

  isBookmarked(id) {
    return this.bookmarks.includes(id);
  },

  getStatus(id) {
    return this.statuses[id] || 'not_started';
  },
};

/* ── 4. TOAST SYSTEM ────────────────────────────── */
const Toast = {
  container: null,
  queue: [],

  init() {
    this.container = document.getElementById('toast-container');

    const pendingToast = sessionStorage.getItem('pendingToast');
    if (pendingToast) {
        try {
            const data = JSON.parse(pendingToast);
            this.show(data.type, data.title, data.msg);
        } catch (e) {
            console.warn('[VITH LMS] Gagal memuat pending toast:', e);
        }
        sessionStorage.removeItem('pendingToast');
    }
  },

  show(type, title, msg, duration = 3000) {
    const icons = {
      success: '✓',
      info:    'ℹ',
      warning: '⚠',
      error:   '✕',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="toast-icon" aria-hidden="true">${icons[type] || 'ℹ'}</div>
      <div class="toast-body">
        <div class="toast-title">${this._escapeHtml(title)}</div>
        ${msg ? `<div class="toast-msg">${this._escapeHtml(msg)}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Tutup notifikasi">✕</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this._dismiss(toast));

    this.container.appendChild(toast);

    const timer = setTimeout(() => this._dismiss(toast), duration);
    toast._timer = timer;

    // Limit max toasts visible
    const toasts = this.container.querySelectorAll('.toast');
    if (toasts.length > 4) {
      this._dismiss(toasts[0]);
    }
  },

  _dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    clearTimeout(toast._timer);
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, { once: true });
  },

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};

/* ── 5. RENDER ENGINE ───────────────────────────── */
const Renderer = {
  grid: null,

  init() {
    this.grid = document.getElementById('module-grid');
  },

  getCategoryBadgeClass(category) {
    const map = {
      'HTML Dasar':        'badge-html',
      'CSS Styling':       'badge-css',
      'CSS Layout':        'badge-layout',
      'Projek Interaktif': 'badge-project',
    };
    return map[category] || 'badge-html';
  },

  getDifficultyLabel(diff) {
    const map = { beginner: 'Pemula', intermediate: 'Menengah', challenge: 'Tantangan' };
    return map[diff] || diff;
  },

  getDifficultyBadgeClass(diff) {
    return `badge-${diff}`;
  },

  getStatusLabel(status) {
    const map = {
      not_started: 'Belum Dibuka',
      in_progress:  'Sedang Dipelajari',
      completed:    'Selesai',
    };
    return map[status] || 'Belum Dibuka';
  },

  getActionBtn(status, path) {
    if (status === 'completed') {
      return `<a href="${path}" class="btn-action btn-review" aria-label="Tinjau ulang modul">
                <span>Tinjau Ulang</span>
                <span aria-hidden="true">↗</span>
              </a>`;
    }
    if (status === 'in_progress') {
      return `<a href="${path}" class="btn-action btn-continue" aria-label="Lanjutkan belajar modul">
                <span>Lanjutkan</span>
                <span aria-hidden="true">→</span>
              </a>`;
    }
    return `<a href="${path}" class="btn-action btn-start" aria-label="Mulai belajar modul">
              <span>Mulai Belajar</span>
              <span aria-hidden="true">→</span>
            </a>`;
  },

  formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}j ${m}m`;
    if (h > 0) return `${h} jam`;
    return `${m} menit`;
  },

  renderCard(module) {
    const status     = State.getStatus(module.id);
    const isBookmark = State.isBookmarked(module.id);
    const catClass   = this.getCategoryBadgeClass(module.category);
    const diffClass  = this.getDifficultyBadgeClass(module.difficulty);
    const diffLabel  = this.getDifficultyLabel(module.difficulty);
    const statusLabel= this.getStatusLabel(status);
    const actionBtn  = this.getActionBtn(status, module.path);
    const duration   = this.formatDuration(module.duration);
    const bookmarkActive = isBookmark ? 'bookmarked' : '';
    const bookmarkAriaLabel = isBookmark ? 'Hapus dari favorit' : 'Tambahkan ke favorit';

    const dropdownItems = [
      { value: 'not_started', label: 'Belum Dibuka',     dot: 'var(--text-muted)' },
      { value: 'in_progress', label: 'Sedang Dipelajari', dot: 'var(--accent-primary)' },
      { value: 'completed',   label: 'Selesai',           dot: 'var(--accent-secondary)' },
    ].map(opt => {
      const isCurrent = status === opt.value ? 'current' : '';
      return `<button class="dropdown-item ${isCurrent}" data-status="${opt.value}" role="menuitem">
                <span class="dropdown-item-dot" style="background:${opt.dot}" aria-hidden="true"></span>
                ${opt.label}
                ${isCurrent ? '<span class="sr-only"> (status saat ini)</span>' : ''}
              </button>`;
    }).join('');

    const li = document.createElement('article');
    li.className  = `module-card status-${status}`;
    li.dataset.id = module.id;
    li.setAttribute('role', 'listitem');
    li.setAttribute('aria-label', `Modul ${module.number}: ${module.title}`);

    li.innerHTML = `
      <div class="card-top">
        <div class="card-badges">
          <span class="badge ${catClass}">${module.category}</span>
          <span class="badge ${diffClass}">${diffLabel}</span>
        </div>
        <button
          class="btn-bookmark ${bookmarkActive}"
          data-module-id="${module.id}"
          aria-label="${bookmarkAriaLabel}"
          aria-pressed="${isBookmark}"
          title="${bookmarkAriaLabel}"
        >${isBookmark ? '★' : '☆'}</button>
      </div>

      <div class="card-body">
        <div class="card-number" aria-hidden="true">#${module.number}</div>
        <h3 class="card-title">${module.title}</h3>
        <p class="card-desc">${module.desc}</p>
        <div class="card-duration">
          <svg class="duration-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Estimasi: <strong>${duration}</strong></span>
        </div>
      </div>

      <div class="card-footer">
        <span class="badge-status">${statusLabel}</span>
        ${actionBtn}
        <div class="status-dropdown-wrapper">
          <button
            class="btn-status-toggle"
            data-module-id="${module.id}"
            aria-haspopup="true"
            aria-expanded="false"
            aria-label="Ubah status modul ${module.title}"
            title="Ubah Status"
          >⋮</button>
          <div class="status-dropdown-menu" role="menu" aria-label="Pilih status modul">
            <div class="dropdown-label">Ubah Status</div>
            ${dropdownItems}
          </div>
        </div>
      </div>
    `;

    return li;
  },

  renderAll(modules) {
    this.grid.innerHTML = '';

    if (modules.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.setAttribute('role', 'status');
      empty.innerHTML = `
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3 class="empty-title">Tidak Ada Modul Ditemukan</h3>
        <p class="empty-desc">Coba ubah kata kunci pencarian atau filter yang aktif untuk menemukan modul yang Anda cari.</p>
      `;
      this.grid.appendChild(empty);
      return;
    }

    modules.forEach(mod => {
      this.grid.appendChild(this.renderCard(mod));
    });
  },
};

/* ── 6. FILTER ENGINE ───────────────────────────── */
const Filter = {
  apply() {
    const { query, category, status, difficulty } = State.filter;
    const q = query.toLowerCase().trim();

    return MODULES.filter(mod => {
      // Text search
      if (q && !mod.title.toLowerCase().includes(q) && !mod.desc.toLowerCase().includes(q)) return false;

      // Bookmark filter
      if (category === 'bookmark' && !State.isBookmarked(mod.id)) return false;

      // Category filter
      if (category !== 'all' && category !== 'bookmark' && mod.category !== category) return false;

      // Status filter
      if (status !== 'all' && State.getStatus(mod.id) !== status) return false;

      // Difficulty filter
      if (difficulty !== 'all' && mod.difficulty !== difficulty) return false;

      return true;
    });
  },
};

/* ── 7. UI UPDATERS ─────────────────────────────── */
const UI = {
  updateProgress() {
    const total     = MODULES.length;
    const completed = MODULES.filter(m => State.getStatus(m.id) === 'completed').length;
    const inProg    = MODULES.filter(m => State.getStatus(m.id) === 'in_progress').length;
    const bm        = State.bookmarks.length;
    const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalModul = total;

    // Header progress
    const fill  = document.getElementById('progress-fill');
    const stat  = document.getElementById('progress-stat');
    const track = document.getElementById('progress-track');
    if (fill)  fill.style.width  = `${pct}%`;
    if (stat)  stat.textContent  = `${completed} / ${total} Modul`;
    if (track) {
      track.setAttribute('aria-valuenow', pct);
    }

    // Stats bar
    const elCompleted  = document.getElementById('stat-completed');
    const elInProg     = document.getElementById('stat-inprogress');
    const elBookmarks  = document.getElementById('stat-bookmarks');
    const elTotal      = document.getElementById('stat-total');

    if (elCompleted) elCompleted.textContent = completed;
    if (elInProg)    elInProg.textContent    = inProg;
    if (elBookmarks) elBookmarks.textContent = bm;
    if (elTotal)     elTotal.textContent     = total;

    // Time remaining
    const remainingMinutes = MODULES
      .filter(m => State.getStatus(m.id) !== 'completed')
      .reduce((acc, m) => acc + m.duration, 0);
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;
    const timeEl = document.getElementById('time-remaining');
    if (timeEl) timeEl.textContent = `${h}j ${m}m`;

    // Bookmark tag count
    const countBm = document.getElementById('count-bookmark');
    if (countBm) countBm.textContent = bm;
  },
      // Category Updates
  updateCategoryCounts() {
    // Total modul
    const total = MODULES.length;
    const countAll = document.getElementById('count-all');
    if (countAll) countAll.textContent = total;

    // Hitung per kategori
    const categories = ['HTML Dasar', 'CSS Styling', 'CSS Layout', 'Projek Interaktif'];
    const idMap = {
      'HTML Dasar': 'count-html',
      'CSS Styling': 'count-css',
      'CSS Layout': 'count-layout',
      'Projek Interaktif': 'count-project'
    };

    categories.forEach(cat => {
      const count = MODULES.filter(m => m.category === cat).length;
      const el = document.getElementById(idMap[cat]);
      if (el) el.textContent = count;
    });

    // Bookmark count
    const bookmarkCount = State.bookmarks.length;
    const countBookmark = document.getElementById('count-bookmark');
    if (countBookmark) countBookmark.textContent = bookmarkCount;
  },


  updateRoadmap() {
    for (let stage = 1; stage <= 4; stage++) {
      const stageModules = MODULES.filter(m => m.stage === stage);
      const total        = stageModules.length;
      const done         = stageModules.filter(m => State.getStatus(m.id) === 'completed').length;
      const pct          = total > 0 ? Math.round((done / total) * 100) : 0;

      const fill  = document.getElementById(`stage-${stage}-fill`);
      const count = document.getElementById(`stage-${stage}-done`);
      const el    = document.getElementById(`stage-${stage}`);

      if (fill)  fill.style.width  = `${pct}%`;
      if (count) count.textContent = done;

      if (el) {
        el.classList.remove('completed', 'active', 'locked');
        const prevDone = stage === 1 ? true :
          MODULES.filter(m => m.stage === stage - 1)
                 .every(m => State.getStatus(m.id) === 'completed');

        if (done === total && total > 0) {
          el.classList.add('completed');
        } else if (prevDone && done < total) {
          el.classList.add('active');
        } else if (!prevDone) {
          el.classList.add('locked');
        } else {
          el.classList.add('active');
        }

        // Update progressbar ARIA
        const pbEl = el.querySelector('.roadmap-progress-bar');
        if (pbEl) pbEl.setAttribute('aria-valuenow', pct);
      }
    }
  },
    updateResultsCount(filtered) {
      const shown = document.getElementById('results-shown');
      const total = document.getElementById('results-total');
      if (shown) shown.textContent = filtered.length;
      if (total) total.textContent = MODULES.length; // total modul keseluruhan
    },
    updateRoadmapTotals() {
      // Hitung total modul per stage
      const stages = [1, 2, 3, 4];
      stages.forEach(stage => {
        const total = MODULES.filter(m => m.stage === stage).length;
        const totalEl = document.getElementById(`stage-${stage}-total`);
        if (totalEl) totalEl.textContent = total;
      });
    }
};

/* ── 8. MAIN APP CONTROLLER ─────────────────────── */
const App = {
  activeDropdown: null,

  init() {
    State.load();
    Toast.init();
    Renderer.init();

    this.bindEvents();
    this.refresh();
    UI.updateCategoryCounts();
    UI.updateRoadmapTotals();
  },

  refresh() {
    const filtered = Filter.apply();
    Renderer.renderAll(filtered);
    UI.updateProgress();
    UI.updateRoadmap();
    UI.updateResultsCount(filtered);
    UI.updateCategoryCounts();
    UI.updateRoadmapTotals();
    this.bindCardEvents();
  },

  bindEvents() {
    // Search
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');

    searchInput.addEventListener('input', e => {
      State.filter.query = e.target.value;
      searchClear.classList.toggle('visible', e.target.value.length > 0);
      this.refresh();
    });

    searchClear.addEventListener('click', () => {
      searchInput.value       = '';
      State.filter.query      = '';
      searchClear.classList.remove('visible');
      searchInput.focus();
      this.refresh();
    });

    // Category filter tags
    const tagsContainer = document.getElementById('filter-tags');
    tagsContainer.addEventListener('click', e => {
      const btn = e.target.closest('.filter-tag');
      if (!btn) return;
      const cat = btn.dataset.category;
      State.filter.category = cat;

      tagsContainer.querySelectorAll('.filter-tag').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      this.refresh();
    });

    // Status filter
    document.getElementById('filter-status').addEventListener('change', e => {
      State.filter.status = e.target.value;
      this.refresh();
    });

    // Difficulty filter
    document.getElementById('filter-difficulty').addEventListener('change', e => {
      State.filter.difficulty = e.target.value;
      this.refresh();
    });

    // Close dropdowns on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('.status-dropdown-wrapper')) {
        this.closeAllDropdowns();
      }
    });

    // Escape key: close dropdowns & modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
        this.closeModal();
      }
    });

    // Reset button
    document.getElementById('btn-reset').addEventListener('click', () => {
      this.openModal();
    });

    // Modal buttons
    document.getElementById('modal-cancel').addEventListener('click', () => {
      this.closeModal();
    });
    document.getElementById('modal-confirm').addEventListener('click', () => {
      this.confirmReset();
    });
    document.getElementById('reset-modal').addEventListener('click', e => {
      if (e.target === e.currentTarget) this.closeModal();
    });
  },

  bindCardEvents() {
    const grid = document.getElementById('module-grid');

    // Bookmark buttons (event delegation)
    grid.addEventListener('click', e => {
      // Bookmark toggle
      const bmBtn = e.target.closest('.btn-bookmark');
      if (bmBtn) {
        e.stopPropagation();
        const id        = bmBtn.dataset.moduleId;
        const isNowBm   = State.toggleBookmark(id);
        const module    = MODULES.find(m => m.id === id);
        const modName   = module ? module.title : id;

        bmBtn.classList.toggle('bookmarked', isNowBm);
        bmBtn.textContent = isNowBm ? '★' : '☆';
        bmBtn.setAttribute('aria-pressed', isNowBm);
        bmBtn.setAttribute('aria-label', isNowBm ? 'Hapus dari favorit' : 'Tambahkan ke favorit');
        bmBtn.title = isNowBm ? 'Hapus dari favorit' : 'Tambahkan ke favorit';

        UI.updateProgress();
        UI.updateRoadmap();

        const countBm = document.getElementById('count-bookmark');
        if (countBm) countBm.textContent = State.bookmarks.length;

        // Update bookmark filter count tag
        const statBm = document.getElementById('stat-bookmarks');
        if (statBm) statBm.textContent = State.bookmarks.length;

        if (isNowBm) {
          Toast.show('warning', 'Ditambahkan ke Favorit', `"${modName}" tersimpan di bookmark Anda.`);
        } else {
          Toast.show('info', 'Dihapus dari Favorit', `"${modName}" telah dihapus dari bookmark.`);
        }
        return;
      }

      // Status dropdown toggle
      const toggleBtn = e.target.closest('.btn-status-toggle');
      if (toggleBtn) {
        e.stopPropagation();
        const wrapper  = toggleBtn.closest('.status-dropdown-wrapper');
        const menu     = wrapper.querySelector('.status-dropdown-menu');
        const isOpen   = menu.classList.contains('open');

        this.closeAllDropdowns();

        if (!isOpen) {
          menu.classList.add('open');
          toggleBtn.setAttribute('aria-expanded', 'true');
          this.activeDropdown = { menu, toggleBtn };
        }
        return;
      }

      // Dropdown items
      const dropItem = e.target.closest('.dropdown-item[data-status]');
      if (dropItem) {
        e.stopPropagation();
        const newStatus = dropItem.dataset.status;
        const card      = dropItem.closest('.module-card');
        if (!card) return;
        const id        = card.dataset.id;
        const module    = MODULES.find(m => m.id === id);
        const modName   = module ? module.title : id;
        const oldStatus = State.getStatus(id);

        if (oldStatus === newStatus) {
          this.closeAllDropdowns();
          return;
        }

        State.setStatus(id, newStatus);
        this.closeAllDropdowns();

        // Re-render that card in place
        // const newCard = Renderer.renderCard(module);
        // card.replaceWith(newCard);
        // this.bindCardEvents();   

        // UI.updateProgress();
        // UI.updateRoadmap();

        const labels = {
          not_started: 'Belum Dibuka',
          in_progress:  'Sedang Dipelajari',
          completed:    'Selesai',
        };
        const types = { not_started: 'info', in_progress: 'info', completed: 'success' };
        // Toast.show(
        //   types[newStatus],
        //   'Status Diperbarui',
        //   `"${modName}" → ${labels[newStatus]}.`
        // );
        sessionStorage.setItem('pendingToast', JSON.stringify({
            type: types[newStatus],
            title: 'Status Diperbarui',
            msg: `"${modName}" → ${labels[newStatus]}.`
        }));
        window.location.reload();
        return;
      }
    });
  },

  closeAllDropdowns() {
    document.querySelectorAll('.status-dropdown-menu.open').forEach(menu => {
      menu.classList.remove('open');
      const toggle = menu.closest('.status-dropdown-wrapper')?.querySelector('.btn-status-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
    this.activeDropdown = null;
  },

  openModal() {
    const modal = document.getElementById('reset-modal');
    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      document.getElementById('modal-cancel').focus();
    }, 60);
  },

  closeModal() {
    const modal = document.getElementById('reset-modal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.getElementById('btn-reset').focus();
  },

  confirmReset() {
    State.reset();
    // Reset UI filters
    State.filter = { query: '', category: 'all', status: 'all', difficulty: 'all' };
    document.getElementById('search-input').value = '';
    document.getElementById('search-clear').classList.remove('visible');
    document.getElementById('filter-status').value     = 'all';
    document.getElementById('filter-difficulty').value = 'all';
    document.querySelectorAll('.filter-tag').forEach((t, i) => {
      t.classList.toggle('active', i === 0);
      t.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    });

    this.closeModal();
    this.refresh();
    Toast.show('warning', 'Progress Direset', 'Semua data belajar telah dikembalikan ke awal.');
  },
};

/* ── 9. BOOTSTRAP ───────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}