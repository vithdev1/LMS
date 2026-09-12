/* ══════════════════════════════════════════════════
   VITH LMS — Module Tracker (untuk halaman modul)
   Sertakan di setiap halaman modul untuk update status
══════════════════════════════════════════════════ */

(function() {
  'use strict';

  const STORAGE_KEY_STATUS    = 'vith_lms_status';
  const STORAGE_KEY_BOOKMARKS = 'vith_lms_bookmarks';

  window.VITH = {
    /**
     * Update status modul di localStorage.
     * @param {string} moduleId - ID modul, contoh 'mod-01'
     * @param {string} status   - 'in_progress' | 'completed'
     */
    updateStatus(moduleId, status) {
      if (!moduleId) return console.warn('[VITH] moduleId wajib diisi');
      if (!['in_progress', 'completed'].includes(status)) {
        return console.warn('[VITH] status harus "in_progress" atau "completed"');
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY_STATUS);
        const statuses = raw ? JSON.parse(raw) : {};
        statuses[moduleId] = status;
        localStorage.setItem(STORAGE_KEY_STATUS, JSON.stringify(statuses));
        console.log(`[VITH] Status ${moduleId} → ${status}`);
      } catch (e) {
        console.error('[VITH] Gagal update status:', e);
      }
    },

    /**
     * Tandai modul sebagai selesai.
     */
    markCompleted(moduleId) {
      this.updateStatus(moduleId, 'completed');
    },

    /**
     * Tandai modul sebagai sedang dipelajari.
     */
    markInProgress(moduleId) {
      this.updateStatus(moduleId, 'in_progress');
    },
  };

  // Auto-track: saat halaman modul dibuka, kalau status masih
  // 'not_started', ubah jadi 'in_progress'
  const moduleId = document.body.dataset.moduleId;
  if (moduleId) {
    const raw = localStorage.getItem(STORAGE_KEY_STATUS);
    const statuses = raw ? JSON.parse(raw) : {};
    if (!statuses[moduleId] || statuses[moduleId] === 'not_started') {
      window.VITH.markInProgress(moduleId);
    }
  }
})();