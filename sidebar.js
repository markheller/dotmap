document.addEventListener('DOMContentLoaded', function () {
    generateSidebar();
    setupMobileSidebar();
});

function generateSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
        <div class="logo-image">
            <a href="index.html">
                <img src="images/Logo.gif" alt="">
            </a>
        </div>

        <div class="sidebar-list sidebar-projects">
            <a href="page_landscape-workshop.html">Landscape Workshop</a>
            <a href="page_auto-simulacrum.html">Auto-Simulacrum</a>
            <a href="page_siting-invisible-values.html">Siting Invisible Values</a>
            <a href="page_across-the-mainland.html">Across the Mainland</a>
            <a href="page_ibex.html">Ibex</a>
            <a href="page_alphanumeric-sublime.html">Alphanumeric Sublime</a>
            <a href="projects.html">All Projects</a>
        </div>

        <div class="sidebar-list sidebar-other">
            <a href="services_data-visualization.html">Data Visualization</a>
            <a href="services_computational-design.html">Computational Design</a>
            <a href="services_exhibitions.html">Exhibitions</a>
            <a href="services_cartography.html">Cartography</a>
            <a href="services_drone-photogrammetry.html">Drone Photogrammetry</a>
        </div>

        <div class="sidebar-list sidebar-other">
            <a href="writing.html">Writing</a>
            <a href="about.html">About</a>
        </div>

        <footer>
            <p>©2026 DOT MAP, LLC</p>
        </footer>
    `;
}

function setupMobileSidebar() {
    createMobileHeaderIfNeeded();

    // Use event delegation so it works even after header is recreated
    document.addEventListener('click', (e) => {
        if (e.target.closest('.menu-button')) {
            toggleSidebar();
        }
        if (e.target.closest('.menu-overlay')) {
            closeSidebar();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
            const header = document.querySelector('.header');
            const overlay = document.querySelector('.menu-overlay');
            if (header) header.remove();
            if (overlay) overlay.remove();
        } else {
            createMobileHeaderIfNeeded();
        }
    });
}

function createMobileHeaderIfNeeded() {
    if (window.innerWidth > 768) return;

    // Create overlay if needed
    if (!document.querySelector('.menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    // Create header (without menu button)
    if (!document.querySelector('.header')) {
        const header = document.createElement('aside');
        header.className = 'header';
        header.innerHTML = `
            <div class="header-inner">
                <div class="logo-image">
                    <a href="index.html">
                        <img src="images/Logo.gif" alt="">
                    </a>
                </div>
            </div>
        `;
        document.body.insertBefore(header, document.body.firstChild);
    }

    // Create floating menu button (outside header)
    if (!document.querySelector('.menu-button')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-button';
        menuBtn.setAttribute('aria-label', 'Menu');
        menuBtn.innerHTML = `<img src="images/menu.png" alt="Menu" class="menu-icon">`;
        document.body.appendChild(menuBtn);
    }
}


function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.menu-overlay');
    if (!sidebar || !overlay) return;

    const open = sidebar.classList.toggle('mobile-visible');
    overlay.classList.toggle('active', open);
    document.body.classList.toggle('no-scroll', open);
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.menu-overlay');
    if (!sidebar || !overlay) return;

    sidebar.classList.remove('mobile-visible');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}