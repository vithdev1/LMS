/* ══════════════════════════════════════════════════
   VITH EDUCATION LMS — Core Application Script
   Pure Vanilla JS | No dependencies
══════════════════════════════════════════════════ */





'use strict';

/* ── 1. MODULE DATA DEFINITIONS ─────────────────── */
// const MODULES = [
//   {
//     id: 'mod-01',
//     number: '01',
//     title: 'Pengenalan HTML & Setup',
//     desc: 'Apa itu HTML, Perbedaan HTML, CSS, dan JavaScript, Setup text editor, serta membuat dan menjalankan file HTML pertama.',
//     category: 'HTML Dasar',
//     difficulty: 'beginner',
//     stage: 1,
//     duration: 60,
//     path: 'modules/01-pengenalan-html/index.html',
//   },
// ];
const MODULES = [
  // ── STAGE 1: Fondasi HTML ─────────────────────
  {
    id: 'mod-01',
    number: '01',
    title: 'Pengenalan HTML & Setup',
    desc: 'Apa itu HTML, perbedaan HTML/CSS/JS, setup text editor, dan membuat file HTML pertama Anda.',
    category: 'HTML Dasar',
    difficulty: 'beginner',
    stage: 1,
    duration: 60,
    path: 'modules/01-pengenalan-html/index.html',
  },
  {
    id: 'mod-02',
    number: '02',
    title: 'Tag, Elemen & Atribut',
    desc: 'Memahami struktur tag HTML, elemen void, atribut global, dan cara membaca dokumentasi MDN.',
    category: 'HTML Dasar',
    difficulty: 'beginner',
    stage: 1,
    duration: 75,
    path: 'modules/02-tag-elemen-atribut/index.html',
  },
  {
    id: 'mod-03',
    number: '03',
    title: 'HTML Semantik & Aksesibilitas',
    desc: 'Menggunakan tag semantik (header, nav, main, article) dan atribut ARIA untuk web yang inklusif.',
    category: 'HTML Dasar',
    difficulty: 'intermediate',
    stage: 1,
    duration: 90,
    path: 'modules/03-html-semantik/index.html',
  },

  // ── STAGE 2: CSS Styling ─────────────────────
  {
    id: 'mod-04',
    number: '04',
    title: 'Pengenalan CSS & Selectors',
    desc: 'Cara kerja CSS, tiga cara menyisipkan style, selector dasar, dan spesifisitas.',
    category: 'CSS Styling',
    difficulty: 'beginner',
    stage: 2,
    duration: 80,
    path: 'modules/04-pengenalan-css/index.html',
  },
  {
    id: 'mod-05',
    number: '05',
    title: 'Warna, Tipografi & Box Model',
    desc: 'Sistem warna CSS, font, line-height, padding, border, margin, dan box-sizing.',
    category: 'CSS Styling',
    difficulty: 'beginner',
    stage: 2,
    duration: 85,
    path: 'modules/05-warna-tipografi/index.html',
  },
  {
    id: 'mod-06',
    number: '06',
    title: 'Pseudo-class & Pseudo-element',
    desc: 'Selector lanjutan: :hover, :focus, :nth-child, ::before, ::after, dan kombinasinya.',
    category: 'CSS Styling',
    difficulty: 'intermediate',
    stage: 2,
    duration: 100,
    path: 'modules/06-pseudo-class/index.html',
  },

  // ── STAGE 3: CSS Layout ─────────────────────
  {
    id: 'mod-07',
    number: '07',
    title: 'Flexbox Fundamental',
    desc: 'Display flex, main axis, cross axis, justify-content, align-items, dan flex items.',
    category: 'CSS Layout',
    difficulty: 'intermediate',
    stage: 3,
    duration: 110,
    path: 'modules/07-flexbox/index.html',
  },
  {
    id: 'mod-08',
    number: '08',
    title: 'CSS Grid Layout',
    desc: 'Grid container, template areas, fr unit, auto-fit, minmax, dan nested grid.',
    category: 'CSS Layout',
    difficulty: 'intermediate',
    stage: 3,
    duration: 120,
    path: 'modules/08-css-grid/index.html',
  },
  {
    id: 'mod-09',
    number: '09',
    title: 'Responsive Design & Media Queries',
    desc: 'Mobile-first, breakpoints, unit relative (rem, em, vw), clamp(), dan container queries.',
    category: 'CSS Layout',
    difficulty: 'challenge',
    stage: 3,
    duration: 130,
    path: 'modules/09-responsive/index.html',
  },

  // ── STAGE 4: Projek Interaktif ─────────────────
  {
    id: 'mod-10',
    number: '10',
    title: 'DOM Manipulation Dasar',
    desc: 'querySelector, event listener, classList, createElement, dan manipulasi atribut.',
    category: 'Projek Interaktif',
    difficulty: 'intermediate',
    stage: 4,
    duration: 120,
    path: 'modules/10-dom-dasar/index.html',
  },
  {
    id: 'mod-11',
    number: '11',
    title: 'LocalStorage & State Management',
    desc: 'Menyimpan data di browser, JSON serialization, dan pola state management vanilla.',
    category: 'Projek Interaktif',
    difficulty: 'challenge',
    stage: 4,
    duration: 140,
    path: 'modules/11-localstorage/index.html',
  },
  {
    id: 'mod-12',
    number: '12',
    title: 'Projek Akhir: Todo App',
    desc: 'Membangun aplikasi todo lengkap dengan CRUD, filter, dan persistensi localStorage.',
    category: 'Projek Interaktif',
    difficulty: 'challenge',
    stage: 4,
    duration: 180,
    path: 'modules/12-todo-app/index.html',
  },
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

    toast._timer = setTimeout(() => this._dismiss(toast), duration);

    // Pause on hover (mouse)
    const pause = () => {
      clearTimeout(toast._timer);
    };
    const resume = () => {
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => this._dismiss(toast), duration);
    };

    toast.addEventListener('mouseenter', pause);
    toast.addEventListener('mouseleave', resume);
    toast.addEventListener('focusin', pause);
    toast.addEventListener('focusout', resume);

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
  <span class="badge-status" aria-label="Status modul: ${statusLabel}">
    ${statusLabel}
  </span>
  ${actionBtn}
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

      const prevModules = MODULES.filter(m => m.stage === stage - 1);
      const prevDone = stage === 1 
      ? true 
      : (prevModules.length > 0 && prevModules.every(m => State.getStatus(m.id) === 'completed'));

      if (fill)  fill.style.width  = `${pct}%`;
      if (count) count.textContent = done;
      if (el) {
        el.classList.remove('completed', 'active', 'locked', 'empty');

        if (done === total && total > 0) {
          el.classList.add('completed');
        } else if (prevDone && done < total && total > 0) {
          el.classList.add('active');
        } else if (!prevDone && total > 0) {
          el.classList.add('locked');
        } else {
          el.classList.add('empty');
          // el.style.display = 'none'; // opsional jika ingin disembunyikan total
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
  if (total) total.textContent = MODULES.length;
  
  // Announce ke screen reader (live region yang sudah ada di HTML)
  const resultsInfo = document.querySelector('.results-info');
  if (resultsInfo && filtered.length === 0) {
    // Pesan khusus kalau tidak ada hasil
    const countEl = document.getElementById('results-count');
    if (countEl) {
      countEl.innerHTML = `Tidak ada modul cocok dengan filter yang dipilih.`;
    }
  } else if (resultsInfo) {
    const countEl = document.getElementById('results-count');
    if (countEl) {
      countEl.innerHTML = `Menampilkan <strong id="results-shown">${filtered.length}</strong> dari <strong id="results-total">${MODULES.length}</strong> modul`;
    }
  }
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

  init() {
    State.load();
    Toast.init();
    Renderer.init();
    this.bindStorageSync();

    this.bindEvents();
    this.bindCardEvents();
    this.refresh();
    UI.updateCategoryCounts();
    UI.updateRoadmapTotals();
  },

  refresh() {
    const runUpdate = () => {
      const filtered = Filter.apply();
      Renderer.renderAll(filtered);
      UI.updateProgress();
      UI.updateRoadmap();
      UI.updateResultsCount(filtered);
      UI.updateCategoryCounts();
      UI.updateRoadmapTotals();
    };

    // Feature detection: pakai View Transitions kalau didukung
    if (document.startViewTransition) {
      document.startViewTransition(runUpdate);
    } else {
      runUpdate();
    }
  },

  bindStorageSync() {
    // 1. Sync dari tab lain via storage event
    window.addEventListener('storage', e => {
      if (e.key !== STORAGE_KEY_STATUS && e.key !== STORAGE_KEY_BOOKMARKS) return;

      try {
        if (e.key === STORAGE_KEY_STATUS && e.newValue) {
          State.statuses = JSON.parse(e.newValue);
        }
        if (e.key === STORAGE_KEY_BOOKMARKS && e.newValue) {
          State.bookmarks = JSON.parse(e.newValue);
        }
      } catch (err) {
        console.warn('[VITH LMS] Storage sync error:', err);
        return;
      }

      this.refresh();
      Toast.show(
        'info',
        'Sinkronisasi Tab',
        'Data belajar diperbarui dari tab lain.'
      );
    });

    // 2. Sync saat tab kembali fokus (mis. dari halaman modul)
    window.addEventListener('focus', () => {
      const currentRaw = localStorage.getItem(STORAGE_KEY_STATUS);
      const cachedRaw  = JSON.stringify(State.statuses);
      if (currentRaw && currentRaw !== cachedRaw) {
        try {
          State.statuses = JSON.parse(currentRaw);
          this.refresh();
        } catch (e) {
          /* skip silent */
        }
      }
    });
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

    // Keyboard shortcut: "/" untuk fokus ke search
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
      this._trapFocus(e);
      // Abaikan kalau ada modifier key
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      // Abaikan kalau user sedang mengetik di form field
      const tag = document.activeElement?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
                    || document.activeElement?.isContentEditable;
      if (isTyping) return;
      
      if (e.key === '/') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });

    // Escape di dalam search: bersihkan input
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape' && e.target.value.length > 0) {
        e.stopPropagation();
        searchInput.value = '';
        State.filter.query = '';
        searchClear.classList.remove('visible');
        this.refresh();
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

  // Hanya handle bookmark (event delegation)
  grid.addEventListener('click', e => {
    const bmBtn = e.target.closest('.btn-bookmark');
    if (!bmBtn) return;

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

    const statBm = document.getElementById('stat-bookmarks');
    if (statBm) statBm.textContent = State.bookmarks.length;

    if (isNowBm) {
      Toast.show('warning', 'Ditambahkan ke Favorit', `"${modName}" tersimpan di bookmark Anda.`);
    } else {
      Toast.show('info', 'Dihapus dari Favorit', `"${modName}" telah dihapus dari bookmark.`);
    }
  });
},



openModal() {
  const modal = document.getElementById('reset-modal');
  
  // Simpan elemen yang fokus sebelum modal (untuk restore nanti)
  this._previouslyFocused = document.activeElement;
  
  modal.classList.add('open');
  modal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  
  // Set inert pada background agar tidak bisa di-tab
  this._setBackgroundInert(true);
  
  setTimeout(() => {
    document.getElementById('modal-cancel').focus();
  }, 60);
},

closeModal() {
  const modal = document.getElementById('reset-modal');
  
  if (!modal.classList.contains('open')) return;
  
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  this._setBackgroundInert(false);
  
  if (this._previouslyFocused && document.contains(this._previouslyFocused)) {
    this._previouslyFocused.focus();
  } else {
    document.getElementById('btn-reset').focus();
  }
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

_setBackgroundInert(isInert) {
  const targets = [
    document.querySelector('.site-header'),
    document.querySelector('.site-main'),
    document.querySelector('.site-footer'),
  ];
  targets.forEach(el => {
    if (!el) return;
    if (isInert) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  });
},

_trapFocus(e) {
  if (e.key !== 'Tab') return;
  const modal = document.getElementById('reset-modal');
  if (!modal.classList.contains('open')) return;
  
  const focusable = modal.querySelectorAll(
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;
  
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
},
};

/* ── 9. BOOTSTRAP ───────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}