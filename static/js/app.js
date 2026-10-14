/**
 * Main Application Orchestrator
 * Integrates Router, State, API, Matrix Engine, and Template Renderers
 */

import { fetchProfileData } from './api.js';
import { state } from './state.js';
import { router } from './router.js';
import { MatrixRainEngine } from './matrix-canvas.js';
import { renderNormalView } from './templates/normal-view.js';
import { renderDevModeView } from './templates/devmode-view.js';
import { renderMatrixView } from './templates/matrix-view.js';

class PortfolioApp {
  constructor() {
    this.appEl = document.getElementById('app');
    this.canvasEl = document.getElementById('matrix-canvas');
    this.profileData = null;
    this.matrixEngine = null;

    this.init();
  }

  async init() {
    // 1. Initialize Matrix Rain Canvas Engine
    if (this.canvasEl) {
      this.matrixEngine = new MatrixRainEngine(this.canvasEl, state);
    }

    // 2. Render Shared App Chrome (Nav, Main container, Footer, Toast)
    this.renderLayout();

    // 3. Show Loading State in Main View
    const viewContainer = document.getElementById('view-root');
    viewContainer.innerHTML = `
      <div class="container" style="padding: 6rem 1rem; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 0.75rem; font-family: var(--font-mono); font-size: 1.1rem; color: var(--text-heading);">
          <span style="display: inline-block; width: 14px; height: 14px; border: 2px solid var(--accent-primary); border-top-color: transparent; border-radius: 50%; animation: spinLoader 0.7s linear infinite;"></span>
          <span>Loading Portfolio Profile...</span>
        </div>
      </div>
      <style>
        @keyframes spinLoader { to { transform: rotate(360deg); } }
      </style>
    `;

    // 4. Fetch Real API Data
    const result = await fetchProfileData();
    if (!result.success) {
      this.renderErrorState(result.error);
      return;
    }
    this.profileData = result.data;

    // 5. Initial Render
    this.renderCurrentView();

    // 6. Subscribe to State Changes (Template or Theme switch)
    state.subscribe(() => {
      this.updateControlsUI();
      this.renderCurrentView(true);
    });

    // 7. Subscribe to Route Changes (Home, Side Quests, Writing)
    router.subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.renderCurrentView(false);
      this.closeMobileMenu();
    });

    // 8. Attach Navigation Controls Event Handlers
    this.setupControlsHandlers();
  }

  renderLayout() {
    this.appEl.innerHTML = `
      <!-- Sticky Navigation Bar -->
      <nav class="site-nav" aria-label="Main Navigation">
        <div class="container-wide nav-inner">
          <!-- Brand -->
          <a href="/" data-link class="brand" aria-label="Oussama Zmitri Portfolio">
            <span class="brand-badge">OZ</span>
            <span>Oussama Zmitri</span>
          </a>

          <!-- Page Links -->
          <ul class="nav-links">
            <li><a href="/" data-link class="nav-link">Portfolio</a></li>
            <li><a href="/side-quests" data-link class="nav-link">Side Quests</a></li>
            <li><a href="/writing" data-link class="nav-link">Writing</a></li>
          </ul>

          <!-- Controls: Template Selector & Theme Toggle -->
          <div class="nav-controls">
            <!-- Template Switcher -->
            <div class="template-switcher" role="radiogroup" aria-label="Portfolio Presentation Template">
              <button type="button" class="template-btn ${state.template === 'normal' ? 'active' : ''}" data-template-btn="normal" aria-checked="${state.template === 'normal'}" role="radio">
                <span>✦</span>
                <span class="label">Normal</span>
              </button>
              <button type="button" class="template-btn ${state.template === 'devmode' ? 'active' : ''}" data-template-btn="devmode" aria-checked="${state.template === 'devmode'}" role="radio">
                <span>&lt;/&gt;</span>
                <span class="label">Dev Mode</span>
              </button>
              <button type="button" class="template-btn ${state.template === 'matrix' ? 'active' : ''}" data-template-btn="matrix" aria-checked="${state.template === 'matrix'}" role="radio">
                <span>⚡</span>
                <span class="label">Matrix</span>
              </button>
            </div>

            <!-- Theme Toggle -->
            <button type="button" class="theme-toggle-btn" id="theme-toggle-btn" aria-label="Toggle light and dark mode">
              <svg id="theme-icon" viewBox="0 0 24 24">
                ${state.theme === 'dark' ? this.getSunIcon() : this.getMoonIcon()}
              </svg>
            </button>

            <!-- Mobile Hamburger Toggle -->
            <button type="button" class="mobile-nav-toggle" id="mobile-toggle-btn" aria-label="Open navigation menu" aria-expanded="false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Drawer -->
        <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
          <ul class="mobile-nav-links">
            <li><a href="/" data-link class="nav-link mobile-nav-link">Portfolio</a></li>
            <li><a href="/side-quests" data-link class="nav-link mobile-nav-link">Side Quests</a></li>
            <li><a href="/writing" data-link class="nav-link mobile-nav-link">Writing</a></li>
          </ul>
        </div>
      </nav>

      <!-- Main Dynamic View Root -->
      <main id="view-root"></main>

      <!-- Site Footer -->
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
                <span class="brand-badge">OZ</span>
                <h3>Oussama Zmitri</h3>
              </div>
              <p>Fourth-year IT student at Tunis Business School. Backend & AI developer seeking a 2027 graduation internship (PFE).</p>
            </div>

            <div class="footer-col">
              <h4>Navigation</h4>
              <ul class="footer-links">
                <li><a href="/" data-link class="footer-link">Main Portfolio</a></li>
                <li><a href="/side-quests" data-link class="footer-link">Side Quests</a></li>
                <li><a href="/writing" data-link class="footer-link">Writing Archive</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Curriculum Vitae</h4>
              <ul class="footer-links">
                <li><a href="/apis/get_cv?langauge=english&download=1" class="footer-link" target="_blank">Download CV (English) ↗</a></li>
                <li><a href="/apis/get_cv?langauge=french&download=1" class="footer-link" target="_blank">Download CV (French) ↗</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>
              <span>© ${new Date().getFullYear()} Oussama Zmitri. All rights reserved.</span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <span>Mode: <strong style="color: var(--text-heading);">${state.template.toUpperCase()}</strong></span>
              <span>•</span>
              <span>Theme: <strong style="color: var(--text-heading);">${state.theme.toUpperCase()}</strong></span>
            </div>
          </div>
        </div>
      </footer>

      <!-- Toast Container -->
      <div class="toast-container" id="toast-container"></div>
    `;

    // Ensure active router styles
    router.updateView();
  }

  renderCurrentView(preserveScroll = false) {
    if (!this.profileData) return;

    const scrollY = window.scrollY;
    const viewContainer = document.getElementById('view-root');
    const currentPath = router.getCurrentPath();

    switch (state.template) {
      case 'devmode':
        renderDevModeView(viewContainer, this.profileData, currentPath);
        break;
      case 'matrix':
        renderMatrixView(viewContainer, this.profileData, currentPath, state);
        break;
      case 'normal':
      default:
        renderNormalView(viewContainer, this.profileData, currentPath);
        break;
    }

    if (preserveScroll && scrollY > 0) {
      window.scrollTo(0, scrollY);
    }
  }

  renderErrorState(errorMessage) {
    const viewContainer = document.getElementById('view-root');
    viewContainer.innerHTML = `
      <div class="container" style="padding: 6rem 1rem; text-align: center;">
        <div style="background-color: var(--bg-card); border: 1px solid #ef4444; border-radius: var(--radius-md); padding: 3rem 2rem; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444; font-size: 1.5rem; margin-bottom: 0.75rem;">Backend Connection Notice</h2>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${errorMessage}</p>
          <button type="button" class="btn btn-primary" id="retry-fetch-btn">
            Retry Connection
          </button>
        </div>
      </div>
    `;

    const retryBtn = document.getElementById('retry-fetch-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.init());
    }
  }

  setupControlsHandlers() {
    // Template Switcher Buttons
    const templateButtons = document.querySelectorAll('[data-template-btn]');
    templateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTemplate = btn.dataset.templateBtn;
        state.setTemplate(targetTemplate);
      });
    });

    // Theme Toggle Button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.toggleTheme();
      });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  updateControlsUI() {
    // Update template buttons
    document.querySelectorAll('[data-template-btn]').forEach(btn => {
      const isSelected = btn.dataset.templateBtn === state.template;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));
    });

    // Update theme toggle icon
    const iconEl = document.getElementById('theme-icon');
    if (iconEl) {
      iconEl.innerHTML = state.theme === 'dark' ? this.getSunIcon() : this.getMoonIcon();
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    }
  }

  getSunIcon() {
    return `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 100-10 5 5 0 000 10z" fill="none" stroke="currentColor" stroke-width="2"/>`;
  }

  getMoonIcon() {
    return `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none" stroke="currentColor" stroke-width="2"/>`;
  }
}

// Global Toast helper
export function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
