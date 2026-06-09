// app.js

// Map module IDs to check validity
const modulesMap = {
    'simple': true,
    'compuesto': true,
    'tasas': true,
    'fechafocal': true,
    'anualidades': true,
    'amortizacion': true,
    'creditos': true,
    'pruebas': true
};

// DOM References
const mainContent = document.getElementById('mainContent');
const sidebar = document.getElementById('sidebar');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const body = document.body;

// Active state helper for navigation
function updateActiveLink(moduleId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-module') === moduleId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Show Loading State in Main Panel
function showLoading() {
    mainContent.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando módulo...</p>
        </div>
    `;
}

// Load Module from window.FinanceModules
function loadModule(moduleId) {
    if (!modulesMap[moduleId]) return;
    
    showLoading();
    
    try {
        const module = window.FinanceModules[moduleId];
        if (!module) {
            throw new Error(`El módulo '${moduleId}' no está cargado en el objeto global.`);
        }
        
        // Render module content
        mainContent.innerHTML = module.render();
        
        // Execute module initialization logic
        if (typeof module.init === 'function') {
            module.init();
        }
        
        // Update URL hash without causing double loading
        if (window.location.hash !== `#${moduleId}`) {
            window.location.hash = moduleId;
        }
        
        // Update styling of active sidebar items
        updateActiveLink(moduleId);
        
        // On mobile, close sidebar after clicking a module
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('open');
        }
        
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error(`Error loading module ${moduleId}:`, error);
        mainContent.innerHTML = `
            <div class="card" style="margin-top: 40px; border-color: #ef4444;">
                <h2 class="card-title" style="color: #ef4444;">
                    <i data-lucide="alert-triangle"></i> Error al cargar el módulo
                </h2>
                <p>No se pudo cargar el módulo de forma estática en local.</p>
                <p style="margin-top: 10px; font-size: 0.85rem; color: var(--text-secondary);">${error.message}</p>
            </div>
        `;
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

// Setup Event Listeners
function setupEvents() {
    // Nav links click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleId = link.getAttribute('data-module');
            loadModule(moduleId);
        });
    });

    // Mobile Sidebar Toggles
    if (menuToggleBtn && closeSidebarBtn && sidebar) {
        menuToggleBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });

        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Theme Toggle Logic
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-theme');
            if (isDark) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
                updateThemeToggleUI('light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                updateThemeToggleUI('dark');
            }
        });
    }

    // Hash Router Listener
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (modulesMap[hash]) {
            loadModule(hash);
        }
    });
}

// Update Theme Toggle Buttons/Texts
function updateThemeToggleUI(theme) {
    const iconDark = themeToggleBtn.querySelector('.theme-icon-dark');
    const iconLight = themeToggleBtn.querySelector('.theme-icon-light');
    const textSpan = themeToggleBtn.querySelector('.theme-text');
    
    if (theme === 'dark') {
        iconDark.style.display = 'none';
        iconLight.style.display = 'block';
        textSpan.textContent = 'Modo Claro';
    } else {
        iconDark.style.display = 'block';
        iconLight.style.display = 'none';
        textSpan.textContent = 'Modo Oscuro';
    }
}

// Initial Theme Setup
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        updateThemeToggleUI('dark');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        updateThemeToggleUI('light');
    }
}

// Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
    // Setup Lucide icons initially
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    initTheme();
    setupEvents();
    
    // Load initial module based on URL hash or default to 'simple'
    const hash = window.location.hash.replace('#', '');
    const initialModule = modulesMap[hash] ? hash : 'simple';
    loadModule(initialModule);
});
