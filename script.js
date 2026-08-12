
// --- DATA MODUL LMS ---
const MODULES_DATA = [
    {
        id: "01-html-dasar",
        number: "01",
        title: "HTML5 Dasar & Struktur Dokumen",
        category: "HTML Dasar",
        description: "Pelajari fondasi utama pembuatan website: sintaks tag HTML, atribut, struktur `<!DOCTYPE html>`, `<head>`, dan `<body>`.",
        path: "modules/01-html-dasar/index.html",
        duration: "45 Menit",
        difficulty: "Pemula"
    },
    {
        id: "02-html-semantik",
        number: "02",
        title: "HTML Semantik & Form Interaktif",
        category: "HTML Dasar",
        description: "Strukturkan web modern menggunakan `<header>`, `<nav>`, `<main>`, `<section>`, serta buat formulir input interaktif.",
        path: "modules/02-html-semantik/index.html",
        duration: "60 Menit",
        difficulty: "Pemula"
    },
    {
        id: "03-css-dasar",
        number: "03",
        title: "CSS Dasar, Selektor & Box Model",
        category: "CSS Styling",
        description: "Memberikan gaya pada elemen HTML, menguasai selektor CSS, pewarnaan, tipografi, serta aturan Margin, Border, & Padding.",
        path: "modules/03-css-dasar/index.html",
        duration: "60 Menit",
        difficulty: "Pemula"
    },
    {
        id: "04-css-flexbox",
        number: "04",
        title: "CSS Layouting: Flexbox Mastering",
        category: "CSS Layout",
        description: "Kuasai tata letak 1-dimensi modern dengan Flexbox: flex-direction, justify-content, align-items, dan teknik responsive layout.",
        path: "modules/04-css-flexbox/index.html",
        duration: "75 Menit",
        difficulty: "Menengah"
    },
    {
        id: "05-css-grid",
        number: "05",
        title: "CSS Grid System & Responsive Web",
        category: "CSS Layout",
        description: "Bangun tata letak 2-dimensi kompleks dengan CSS Grid, grid-template-areas, serta breakpoint Media Queries.",
        path: "modules/05-css-grid/index.html",
        duration: "90 Menit",
        difficulty: "Menengah"
    },
    {
        id: "06-projek-portofolio",
        number: "06",
        title: "Projek Akhir: Build Portfolio Website",
        category: "Projek Interaktif",
        description: "Integrasikan seluruh pemahaman HTML5 & CSS3 untuk membangun situs web Portofolio Pribadi yang siap di-publish.",
        path: "modules/06-projek-portofolio/index.html",
        duration: "120 Menit",
        difficulty: "Tantangan"
    }
];


        // --- LOCALSTORAGE MANAGEMENT ---
        const STORAGE_KEY = "vith_lms_module_states_v1";

        function getSavedStates() {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                return saved ? JSON.parse(saved) : {};
            } catch (e) {
                console.error("Gagal membaca localStorage:", e);
                return {};
            }
        }

        function saveStates(states) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
            } catch (e) {
                console.error("Gagal menyimpan ke localStorage:", e);
            }
        }

        function setModuleStatus(id, newStatus) {
            const states = getSavedStates();
            states[id] = newStatus;
            saveStates(states);
            renderDashboard();
            showToast(getToastText(newStatus));
        }

        // function resetAllProgress() {
        //     if (confirm("Apakah Anda yakin ingin menghapus semua progress belajar Anda? Status akan dikembalikan ke kondisi awal.")) {
        //         localStorage.removeItem(STORAGE_KEY);
        //         renderDashboard();
        //         showToast("Progress telah berhasil direset!");
        //     }
        // }

        function getToastText(status) {
            switch(status) {
                case 'completed': return "Selamat! Modul ditandai Selesai 🎉";
                case 'in_progress': return "Modul diset menjadi Sedang Dipelajari ⏳";
                case 'not_started': return "Status modul dikembalikan ke Belum Mulai 🔒";
                default: return "Progress diperbarui!";
            }
        }

        // --- STATE SEARCH & FILTER ---
        let activeCategory = "all";
        let activeSearchQuery = "";
        let activeStatusFilter = "all";

        const modulesGrid = document.getElementById("modulesGrid");
        const emptyState = document.getElementById("emptyState");
        const searchInput = document.getElementById("searchInput");
        const clearSearchBtn = document.getElementById("clearSearchBtn");
        const categoryFilterContainer = document.getElementById("categoryFilterContainer");
        const statusSelectFilter = document.getElementById("statusSelectFilter");
        
        // Metrics DOM
        const overallProgressFill = document.getElementById("overallProgressFill");
        const completedCountText = document.getElementById("completedCountText");
        const percentageText = document.getElementById("percentageText");
        const totalModulesCount = document.getElementById("totalModulesCount");
        const completedModulesCount = document.getElementById("completedModulesCount");
        const inProgressModulesCount = document.getElementById("inProgressModulesCount");
        const visibleModulesCount = document.getElementById("visibleModulesCount");

        // --- RENDER LOGIC ---
        function renderDashboard() {
            const states = getSavedStates();
            let totalModul = MODULES_DATA.length;
            let completedCount = 0;
            let inProgressCount = 0;

            MODULES_DATA.forEach(mod => {
                const status = states[mod.id] || "not_started";
                if (status === "completed") completedCount++;
                if (status === "in_progress") inProgressCount++;
            });

            const percent = totalModul > 0 ? Math.round((completedCount / totalModul) * 100) : 0;

            // Update UI Metrics
            completedCountText.innerText = `${completedCount}/${totalModul}`;
            percentageText.innerText = `${percent}%`;
            overallProgressFill.style.width = `${percent}%`;
            totalModulesCount.innerText = totalModul;
            completedModulesCount.innerText = completedCount;
            inProgressModulesCount.innerText = inProgressCount;

            
            updateRoadmapHighlights(completedCount);

            const filteredModules = MODULES_DATA.filter(mod => {
                const status = states[mod.id] || "not_started";
                const matchCategory = (activeCategory === "all") || (mod.category === activeCategory);
                const matchStatus = (activeStatusFilter === "all") || (status === activeStatusFilter);
                const query = activeSearchQuery.toLowerCase().trim();
                const matchSearch = query === "" || 
                    mod.title.toLowerCase().includes(query) || 
                    mod.description.toLowerCase().includes(query);

                return matchCategory && matchStatus && matchSearch;
            });

            visibleModulesCount.innerText = `Menampilkan ${filteredModules.length} dari ${total} modul`;
            modulesGrid.innerHTML = "";

            if (filteredModules.length === 0) {
                emptyState.style.display = "flex";
            } else {
                emptyState.style.display = "none";
                filteredModules.forEach(mod => {
                    const status = states[mod.id] || "not_started";
                    modulesGrid.appendChild(createModuleCard(mod, status));
                });
            }
        }

        function createModuleCard(mod, status) {
            const card = document.createElement("div");
            card.className = `module-card status-${status}`;

            let statusBadgeHTML = "";
            let buttonText = "Mulai Belajar";
            let buttonIcon = "fa-play";

            if (status === "completed") {
                statusBadgeHTML = `<span class="badge badge-completed"><i class="fa-solid fa-circle-check"></i> Selesai</span>`;
                buttonText = "Pelajari Ulang";
                buttonIcon = "fa-rotate-right";
            } else if (status === "in_progress") {
                statusBadgeHTML = `<span class="badge badge-in-progress"><i class="fa-solid fa-clock"></i> Sedang Dipelajari</span>`;
                buttonText = "Lanjutkan Belajar";
                buttonIcon = "fa-arrow-right";
            } else {
                statusBadgeHTML = `<span class="badge badge-not-started"><i class="fa-solid fa-lock"></i> Belum Dibuka</span>`;
            }

            card.innerHTML = `
                <div class="card-header">
                    <div class="category-tag-wrap">
                        <span class="category-tag">${mod.category}</span>
                        <span class="difficulty-tag">${mod.difficulty}</span>
                    </div>
                    ${statusBadgeHTML}
                </div>
                <div class="card-body">
                    <div class="module-title-row">
                        <span class="module-num">#${mod.number}</span>
                        <h3 class="module-title">${mod.title}</h3>
                    </div>
                    <p class="module-desc">${mod.description}</p>
                    <div class="module-meta">
                        <span><i class="fa-solid fa-clock"></i> ${mod.duration}</span>
                        <span><i class="fa-solid fa-code"></i> Interaktif</span>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="${mod.path}" class="btn-primary-action" onclick="onStartModule('${mod.id}', '${status}')">
                        <span>${buttonText}</span> <i class="fa-solid ${buttonIcon}"></i>
                    </a>
                    <div class="status-action-dropdown">
                        <button class="btn-icon-status" title="Ubah Status"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div class="status-menu">
                            <button onclick="setModuleStatus('${mod.id}', 'not_started')" class="${status === 'not_started' ? 'active' : ''}"><i class="fa-solid fa-lock"></i> Set Belum Mulai</button>
                            <button onclick="setModuleStatus('${mod.id}', 'in_progress')" class="${status === 'in_progress' ? 'active' : ''}"><i class="fa-solid fa-spinner"></i> Set Sedang Dipelajari</button>
                            <button onclick="setModuleStatus('${mod.id}', 'completed')" class="${status === 'completed' ? 'active' : ''}"><i class="fa-solid fa-circle-check"></i> Set Selesai</button>
                        </div>
                    </div>
                </div>
            `;
            return card;
        }

        function onStartModule(id, currentStatus) {
            if (currentStatus === "not_started") {
                const states = getSavedStates();
                states[id] = "in_progress";
                saveStates(states);
            }
        }

        function updateRoadmapHighlights(completedCount) {
            const steps = [
                { id: "step-1", threshold: 1 },
                { id: "step-2", threshold: 3 },
                { id: "step-3", threshold: 5 },
                { id: "step-4", threshold: 6 }
            ];
            steps.forEach(s => {
                const el = document.getElementById(s.id);
                if (el) el.classList.toggle("completed", completedCount >= s.threshold);
            });
        }

        // --- TOAST UI ---
        let toastTimeout;
        function showToast(message) {
            const toast = document.getElementById("toast");
            document.getElementById("toastMessage").innerText = message;
            toast.classList.add("show");
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => toast.classList.remove("show"), 3000);
        }

        // --- EVENT LISTENERS ---
        document.addEventListener("DOMContentLoaded", () => {
            renderDashboard();

            searchInput.addEventListener("input", (e) => {
                activeSearchQuery = e.target.value;
                clearSearchBtn.style.display = activeSearchQuery ? "block" : "none";
                renderDashboard();
            });

            clearSearchBtn.addEventListener("click", () => {
                searchInput.value = ""; activeSearchQuery = "";
                clearSearchBtn.style.display = "none";
                renderDashboard();
            });

            categoryFilterContainer.addEventListener("click", (e) => {
                if (e.target.classList.contains("filter-tag")) {
                    document.querySelectorAll(".filter-tag").forEach(btn => btn.classList.remove("active"));
                    e.target.classList.add("active");
                    activeCategory = e.target.getAttribute("data-category");
                    renderDashboard();
                }
            });

            statusSelectFilter.addEventListener("change", (e) => {
                activeStatusFilter = e.target.value;
                renderDashboard();
            });

            // document.getElementById("resetProgressBtn").addEventListener("click", resetAllProgress);
            document.getElementById("resetFilterBtn").addEventListener("click", () => {
                searchInput.value = ""; activeSearchQuery = "";
                activeCategory = "all"; activeStatusFilter = "all";
                statusSelectFilter.value = "all";
                document.querySelectorAll(".filter-tag").forEach(btn => btn.classList.toggle("active", btn.getAttribute("data-category") === "all"));
                clearSearchBtn.style.display = "none";
                renderDashboard();
            });
        });