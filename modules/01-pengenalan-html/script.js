
  (function() {
    'use strict';

    // ── Konfigurasi ──
    const MODULE_ID = 'mod-01';
    const STATUS_KEY = 'vith_lms_status';

    // ── DOM refs ──
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('.section-block');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    const liveEditor = document.getElementById('liveEditor');
    const runBtn = document.getElementById('runBtn');
    const resetCodeBtn = document.getElementById('resetCodeBtn');
    const autoRefresh = document.getElementById('autoRefresh');
    const previewIframe = document.getElementById('previewIframe');
    const placeholderPreview = document.getElementById('placeholderPreview');
    const lineCount = document.getElementById('lineCount');

    const completeBtn = document.getElementById('markComplete');
    const toastContainer = document.getElementById('toastContainer');

    // ── State ──
    let currentStatus = 'not_started';
    let isCompleted = false;
    let hasRendered = false;

    // ── Helper localStorage ──
    function getStatus() {
      try {
        const raw = localStorage.getItem(STATUS_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          return data[MODULE_ID] || 'not_started';
        }
      } catch (_) {}
      return 'not_started';
    }

    function setStatus(status) {
      try {
        let data = {};
        const raw = localStorage.getItem(STATUS_KEY);
        if (raw) data = JSON.parse(raw);
        data[MODULE_ID] = status;
        localStorage.setItem(STATUS_KEY, JSON.stringify(data));
        currentStatus = status;
      } catch (_) {}
    }

    // ── Toast (tidak digunakan lagi, tapi tetap ada) ──
    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${type === 'success' ? '✅' : 'ℹ️'}</span> ${message}`;
      toastContainer.appendChild(toast);
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
    }

    // ── Update progress scroll ──
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        return;
      }
      const percent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      progressFill.style.width = percent + '%';
      progressFill.setAttribute('aria-valuenow', percent);
      progressText.textContent = percent + '%';
    }

    // ── Scroll spy ──
    function updateActiveSection() {
      let currentId = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) {
          currentId = section.id;
        }
      });
      tocLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === currentId);
      });
    }

    // ── Render preview ──
    function renderPreview() {
      const code = liveEditor.value;
      previewIframe.style.display = 'block';
      placeholderPreview.style.display = 'none';
      const doc = previewIframe.contentDocument || previewIframe.contentWindow.document;
      doc.open();
      doc.write(code);
      doc.close();
      hasRendered = true;
      updateLineCount();
    }

    // ── Update line count ──
    function updateLineCount() {
      const lines = liveEditor.value.split('\n').length;
      lineCount.textContent = 'Baris: ' + lines;
    }

    // ── Starter code ──
    const STARTER_CODE = `<h1>Halo, Dunia!</h1>
<p>Ini adalah paragraf pertama saya.</p>
<ul>
<li>Belajar HTML itu menyenangkan</li>
<li>Coba ubah kode ini!</li>
</ul>`;

    // ── Reset kode ──
    function resetCode() {
      liveEditor.value = STARTER_CODE;
      updateLineCount();
      if (autoRefresh.checked) {
        renderPreview();
      } else {
        if (!hasRendered) {
          previewIframe.style.display = 'none';
          placeholderPreview.style.display = 'block';
        } else {
          const doc = previewIframe.contentDocument || previewIframe.contentWindow.document;
          doc.open();
          doc.write('');
          doc.close();
          previewIframe.style.display = 'none';
          placeholderPreview.style.display = 'block';
          hasRendered = false;
        }
      }
      showToast('Kode direset ke contoh awal.', 'info');
    }

    // ── Inisialisasi status ──
    function initStatus() {
      const status = getStatus();
      currentStatus = status;

      // OTMATIS UBAH STATUS JIKA BELUM DIMULAI
      if (status === 'not_started') {
        setStatus('in_progress');
        currentStatus = 'in_progress';
      }

      // Jika sudah completed, disable tombol selesai
      if (currentStatus === 'completed') {
        isCompleted = true;
        completeBtn.textContent = '✅ Selesai';
        completeBtn.disabled = true;
        completeBtn.classList.add('done');
      }
    }

    // ── Tandai selesai & redirect ──
    function markComplete() {
      if (isCompleted) return;

      // 1. Set status completed
      setStatus('completed');
      isCompleted = true;

      // 2. Simpan notifikasi ke sessionStorage untuk dashboard
      const toastData = {
        type: 'success',
        title: 'Modul Selesai! 🎉',
        msg: 'Modul "Pengenalan HTML" telah selesai. Lanjutkan ke modul berikutnya!'
      };
      sessionStorage.setItem('pendingToast', JSON.stringify(toastData));

      // 3. Redirect ke dashboard
      window.location.href = '../../index.html';
    }

    // ── Copy code ──
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const block = this.closest('.code-block');
        if (!block) return;
        const codeElem = block.querySelector('pre code');
        if (!codeElem) return;
        const code = codeElem.textContent;
        navigator.clipboard.writeText(code).then(() => {
          const original = this.textContent;
          this.textContent = '✅ Disalin!';
          setTimeout(() => { this.textContent = original; }, 2000);
        }).catch(() => {
          const textarea = document.createElement('textarea');
          textarea.value = code;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
          const original = this.textContent;
          this.textContent = '✅ Disalin!';
          setTimeout(() => { this.textContent = original; }, 2000);
        });
      });
    });

    // ── Sidebar toggle ──
    sidebarToggle.addEventListener('click', function() {
      const isOpen = sidebar.classList.toggle('open');
      this.setAttribute('aria-expanded', isOpen);
    });

    // ── Smooth scroll TOC ──
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.dataset.target;
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          sidebar.classList.remove('open');
          sidebarToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // ── Scroll events ──
    window.addEventListener('scroll', function() {
      updateProgress();
      updateActiveSection();
    });

    // ── Live editor events ──
    liveEditor.addEventListener('input', function() {
      if (autoRefresh.checked) {
        renderPreview();
      }
      updateLineCount();
    });

    liveEditor.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runBtn.click();
      }
    });

    runBtn.addEventListener('click', function() {
      renderPreview();
    });

    resetCodeBtn.addEventListener('click', resetCode);

    autoRefresh.addEventListener('change', function() {
      if (this.checked) {
        renderPreview();
      }
    });

    completeBtn.addEventListener('click', markComplete);

    // ── Inisialisasi ──
    initStatus();
    updateLineCount();
    if (autoRefresh.checked) {
      renderPreview();
    } else {
      previewIframe.style.display = 'none';
      placeholderPreview.style.display = 'block';
      hasRendered = false;
    }
    updateProgress();
    updateActiveSection();

    console.log(`[VITH] Modul ${MODULE_ID} dimuat. Status: ${currentStatus}`);
  })();