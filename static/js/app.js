/**
 * Main Application Orchestrator
 * Integrates Router, State, API, i18n, Matrix Engine, and Template Renderers
 */

import { fetchProfileData } from './api.js';
import { state } from './state.js';
import { router } from './router.js';
import { initI18n, setLanguage, t } from './i18n.js';
import { MatrixRainEngine } from './matrix-canvas.js';
import { renderNormalView } from './templates/normal-view.js';
import { renderDevModeView, switchDevModeFile } from './templates/devmode-view.js';
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

    // 2. Render Initial Temporary Frame & Loading State
    this.renderLoadingPlaceholder();

    // 3. Initialize Centralized i18n with saved language preference
    await initI18n(state.language);

    // 4. Render App Chrome (Nav, Main container, Footer, Toast) with translated text
    this.renderLayout();

    // 5. Fetch Profile Data from Backend for current language
    const result = await fetchProfileData(state.language);
    if (!result.success) {
      this.renderErrorState(result.error);
      return;
    }
    this.profileData = result.data;

    // 6. Initial Dynamic View Render
    this.renderCurrentView();

    // 7. Subscribe to State Changes (Template, Theme)
    state.subscribe(() => {
      this.updateControlsUI();
      this.updateNavLinks();
      this.renderCurrentView(true);
    });

    // 8. Subscribe to Route Changes (Home, Side Quests, Writing)
    router.subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.updateNavLinks();
      this.renderCurrentView(false);
      this.closeMobileMenu();
    });

    // 9. Attach Navigation Controls Event Handlers
    this.setupControlsHandlers();
  }

  renderLoadingPlaceholder() {
    this.appEl.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
        <div style="display: inline-flex; align-items: center; gap: 0.85rem; font-family: var(--font-mono); font-size: 1.1rem; color: var(--text-heading);">
          <span style="display: inline-block; width: 18px; height: 18px; border: 2.5px solid var(--accent-primary); border-top-color: transparent; border-radius: 50%; animation: spinLoader 0.7s linear infinite;"></span>
          <span id="loading-text">${t('messages.loading', 'Loading Portfolio Profile...')}</span>
        </div>
      </div>
      <style>
        @keyframes spinLoader { to { transform: rotate(360deg); } }
      </style>
    `;
  }

  getNavLinksHtml() {
    const isHome = router.getCurrentPath() === '/' || router.getCurrentPath() === '';
    const template = state.template;

    if (!isHome) {
      return `
        <li><a href="/" data-link class="nav-link">${t('nav.portfolio', 'Portfolio')}</a></li>
        <li><a href="/side-quests" data-link class="nav-link ${router.getCurrentPath() === '/side-quests' ? 'active' : ''}">${t('nav.side_quests', 'Side Quests')}</a></li>
        <li><a href="/writing" data-link class="nav-link ${router.getCurrentPath() === '/writing' ? 'active' : ''}">${t('nav.writing', 'Writing')}</a></li>
      `;
    }

    if (template === 'matrix') {
      return `
        <li class="nav-divider-vertical" aria-hidden="true"></li>
        <li><a href="/side-quests" data-link class="nav-link">${t('nav.side_quests', 'Side Quests')}</a></li>
        <li><a href="/writing" data-link class="nav-link">${t('nav.writing', 'Writing')}</a></li>
      `;
    }

    if (template === 'devmode') {
      return `
        <li><a href="/" data-link class="nav-link active">${t('nav.portfolio', 'Portfolio')}</a></li>
        <li><a href="/side-quests" data-link class="nav-link">${t('nav.side_quests', 'Side Quests')}</a></li>
        <li><a href="/writing" data-link class="nav-link">${t('nav.writing', 'Writing')}</a></li>
      `;
    }

    // Default Normal template
    return `
      <li class="nav-divider-vertical" aria-hidden="true"></li>
      <li><a href="/side-quests" data-link class="nav-link">${t('nav.side_quests', 'Side Quests')}</a></li>
      <li><a href="/writing" data-link class="nav-link">${t('nav.writing', 'Writing')}</a></li>
    `;
  }

  getMobileNavLinksHtml() {
    const isHome = router.getCurrentPath() === '/' || router.getCurrentPath() === '';
    const template = state.template;

    if (!isHome) {
      return `
        <li><a href="/" data-link class="nav-link mobile-nav-link">${t('nav.portfolio', 'Portfolio')}</a></li>
        <li><a href="/side-quests" data-link class="nav-link mobile-nav-link ${router.getCurrentPath() === '/side-quests' ? 'active' : ''}">${t('nav.side_quests', 'Side Quests')}</a></li>
        <li><a href="/writing" data-link class="nav-link mobile-nav-link ${router.getCurrentPath() === '/writing' ? 'active' : ''}">${t('nav.writing', 'Writing')}</a></li>
      `;
    }

    if (template === 'devmode') {
      return `
        <li><a href="#profile.py" class="nav-link mobile-nav-link dev-file-link" data-dev-file="profile.py">🐍 01. ${t('nav.section_about', 'Background')} (profile.py)</a></li>
        <li><a href="#skills.py" class="nav-link mobile-nav-link dev-file-link" data-dev-file="skills.py">🐍 02. ${t('nav.section_skills', 'Skills')} (skills.py)</a></li>
        <li><a href="#projects.py" class="nav-link mobile-nav-link dev-file-link" data-dev-file="projects.py">🐍 03. ${t('nav.section_projects', 'Projects')} (projects.py)</a></li>
        <li><a href="#experience.py" class="nav-link mobile-nav-link dev-file-link" data-dev-file="experience.py">🐍 04. ${t('nav.section_experience', 'Experience')} (experience.py)</a></li>
        <li><a href="#education.py" class="nav-link mobile-nav-link dev-file-link" data-dev-file="education.py">🐍 05. ${t('nav.section_education', 'Education')} (education.py)</a></li>
        <li><a href="#contact.py" class="nav-link mobile-nav-link dev-file-link" data-dev-file="contact.py">🐍 06. ${t('nav.section_contact', 'Contact')} (contact.py)</a></li>
        <li style="border-top: 1px dashed var(--border-card); margin: 0.5rem 0;"></li>
        <li><a href="/side-quests" data-link class="nav-link mobile-nav-link">${t('nav.side_quests', 'Side Quests')}</a></li>
        <li><a href="/writing" data-link class="nav-link mobile-nav-link">${t('nav.writing', 'Writing')}</a></li>
      `;
    }

    if (template === 'matrix') {
      return `
        <li><a href="#matrix-about" class="nav-link mobile-nav-link nav-section-link">[01 // IDENTITY]</a></li>
        <li><a href="#matrix-skills" class="nav-link mobile-nav-link nav-section-link">[02 // SKILLS]</a></li>
        <li><a href="#matrix-projects" class="nav-link mobile-nav-link nav-section-link">[03 // PROJECTS]</a></li>
        <li><a href="#matrix-experience" class="nav-link mobile-nav-link nav-section-link">[04 // LOGS]</a></li>
        <li><a href="#matrix-education" class="nav-link mobile-nav-link nav-section-link">[05 // ACADEMICS]</a></li>
        <li><a href="#matrix-contact" class="nav-link mobile-nav-link nav-section-link">[06 // COMMS]</a></li>
        <li style="border-top: 1px dashed var(--border-card); margin: 0.5rem 0;"></li>
        <li><a href="/side-quests" data-link class="nav-link mobile-nav-link">${t('nav.side_quests', 'Side Quests')}</a></li>
        <li><a href="/writing" data-link class="nav-link mobile-nav-link">${t('nav.writing', 'Writing')}</a></li>
      `;
    }

    return `
      <li><a href="#about" class="nav-link mobile-nav-link nav-section-link">01. ${t('nav.section_about', 'Background')}</a></li>
      <li><a href="#skills" class="nav-link mobile-nav-link nav-section-link">02. ${t('nav.section_skills', 'Skills')}</a></li>
      <li><a href="#projects" class="nav-link mobile-nav-link nav-section-link">03. ${t('nav.section_projects', 'Projects')}</a></li>
      <li><a href="#experience" class="nav-link mobile-nav-link nav-section-link">04. ${t('nav.section_experience', 'Experience')}</a></li>
      <li><a href="#education" class="nav-link mobile-nav-link nav-section-link">05. ${t('nav.section_education', 'Education')}</a></li>
      <li><a href="#contact" class="nav-link mobile-nav-link nav-section-link">06. ${t('nav.section_contact', 'Contact')}</a></li>
      <li style="border-top: 1px dashed var(--border-card); margin: 0.5rem 0;"></li>
      <li><a href="/side-quests" data-link class="nav-link mobile-nav-link">${t('nav.side_quests', 'Side Quests')}</a></li>
      <li><a href="/writing" data-link class="nav-link mobile-nav-link">${t('nav.writing', 'Writing')}</a></li>
    `;
  }

  updateNavLinks() {
    const desktopNav = document.querySelector('.nav-links');
    if (desktopNav) desktopNav.innerHTML = this.getNavLinksHtml();
    const mobileNav = document.querySelector('.mobile-nav-links');
    if (mobileNav) mobileNav.innerHTML = this.getMobileNavLinksHtml();
    this.setupSectionLinkHandlers();
  }

  renderLayout() {
    this.appEl.innerHTML = `
      <!-- Sticky Navigation Bar -->
      <nav class="site-nav" aria-label="${t('nav.menu_aria', 'Main Navigation')}">
        <div class="container-wide nav-inner">
          <!-- Brand -->
          <a href="/" data-link class="brand" aria-label="${t('nav.brand', 'Oussama Zmitri')} Portfolio">
            <img src="/static/images/me_in_suit.png" alt="Oussama Zmitri" class="brand-logo-img">
            <span>${t('nav.brand', 'Oussama Zmitri')}</span>
          </a>

          <!-- Page / Section Navigation Links -->
          <ul class="nav-links">
            ${this.getNavLinksHtml()}
          </ul>

          <!-- Controls: Template Selector, Language Switcher & Theme Toggle -->
          <div class="nav-controls">
            <!-- Language Switcher -->
            <div class="lang-switcher" role="radiogroup" aria-label="${t('language.switcher_aria', 'Language selection')}">
              <button type="button" class="lang-btn ${state.language === 'en' ? 'active' : ''}" data-lang-btn="en" aria-checked="${state.language === 'en'}" role="radio" title="${t('language.en', 'English')}">
                <span>EN</span>
              </button>
              <button type="button" class="lang-btn ${state.language === 'fr' ? 'active' : ''}" data-lang-btn="fr" aria-checked="${state.language === 'fr'}" role="radio" title="${t('language.fr', 'French')}">
                <span>FR</span>
              </button>
            </div>

            <!-- Template Switcher (Desktop) -->
            <div class="template-switcher desktop-template-switcher" role="radiogroup" aria-label="${t('nav.template_switcher_aria', 'Portfolio Presentation Template')}">
              <button type="button" class="template-btn ${state.template === 'normal' ? 'active' : ''}" data-template-btn="normal" aria-checked="${state.template === 'normal'}" role="radio">
                <span>✦</span>
                <span class="label">${t('templates.normal', 'Normal')}</span>
              </button>
              <button type="button" class="template-btn ${state.template === 'devmode' ? 'active' : ''}" data-template-btn="devmode" aria-checked="${state.template === 'devmode'}" role="radio">
                <span>&lt;/&gt;</span>
                <span class="label">${t('templates.devmode', 'Dev Mode')}</span>
              </button>
              <button type="button" class="template-btn ${state.template === 'matrix' ? 'active' : ''}" data-template-btn="matrix" aria-checked="${state.template === 'matrix'}" role="radio">
                <span>⚡</span>
                <span class="label">${t('templates.matrix', 'Matrix')}</span>
              </button>
            </div>

            <!-- Theme Toggle -->
            <button type="button" class="theme-toggle-btn" id="theme-toggle-btn" aria-label="${t('theme.toggle_aria', 'Toggle light and dark mode')}">
              <svg id="theme-icon" viewBox="0 0 24 24">
                ${state.theme === 'dark' ? this.getSunIcon() : this.getMoonIcon()}
              </svg>
            </button>

            <!-- Mobile Hamburger Toggle -->
            <button type="button" class="mobile-nav-toggle" id="mobile-toggle-btn" aria-label="${t('nav.mobile_menu_aria', 'Open navigation menu')}" aria-expanded="false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Mobile Header Template Bar: Visible directly in the header on mobile/phone view -->
        <div class="mobile-nav-template-bar">
          <div class="template-switcher mobile-header-template-switcher" role="radiogroup" aria-label="${t('nav.template_switcher_aria', 'Portfolio Presentation Template')}">
            <button type="button" class="template-btn ${state.template === 'normal' ? 'active' : ''}" data-template-btn="normal" aria-checked="${state.template === 'normal'}" role="radio">
              <span>✦</span>
              <span class="label">${t('templates.normal', 'Normal')}</span>
            </button>
            <button type="button" class="template-btn ${state.template === 'devmode' ? 'active' : ''}" data-template-btn="devmode" aria-checked="${state.template === 'devmode'}" role="radio">
              <span>&lt;/&gt;</span>
              <span class="label">${t('templates.devmode', 'Dev Mode')}</span>
            </button>
            <button type="button" class="template-btn ${state.template === 'matrix' ? 'active' : ''}" data-template-btn="matrix" aria-checked="${state.template === 'matrix'}" role="radio">
              <span>⚡</span>
              <span class="label">${t('templates.matrix', 'Matrix')}</span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Drawer -->
        <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
          <ul class="mobile-nav-links">
            ${this.getMobileNavLinksHtml()}
          </ul>

          <div class="mobile-template-wrap">
            <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">${t('nav.template_switcher_aria', 'Template')}</span>
            <div class="template-switcher" role="radiogroup" aria-label="${t('nav.template_switcher_aria', 'Portfolio Presentation Template')}">
              <button type="button" class="template-btn ${state.template === 'normal' ? 'active' : ''}" data-template-btn="normal" aria-checked="${state.template === 'normal'}" role="radio">
                <span>✦</span>
                <span class="label">${t('templates.normal', 'Normal')}</span>
              </button>
              <button type="button" class="template-btn ${state.template === 'devmode' ? 'active' : ''}" data-template-btn="devmode" aria-checked="${state.template === 'devmode'}" role="radio">
                <span>&lt;/&gt;</span>
                <span class="label">${t('templates.devmode', 'Dev Mode')}</span>
              </button>
              <button type="button" class="template-btn ${state.template === 'matrix' ? 'active' : ''}" data-template-btn="matrix" aria-checked="${state.template === 'matrix'}" role="radio">
                <span>⚡</span>
                <span class="label">${t('templates.matrix', 'Matrix')}</span>
              </button>
            </div>
          </div>

          <div class="mobile-lang-wrap">
            <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">${t('language.current_language', 'Language')}</span>
            <div class="lang-switcher" role="radiogroup">
              <button type="button" class="lang-btn ${state.language === 'en' ? 'active' : ''}" data-lang-btn="en" role="radio">
                <span>EN</span>
              </button>
              <button type="button" class="lang-btn ${state.language === 'fr' ? 'active' : ''}" data-lang-btn="fr" role="radio">
                <span>FR</span>
              </button>
            </div>
          </div>
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
                <h3>${t('footer.brand', 'Oussama Zmitri')}</h3>
              </div>
              <p>${t('footer.bio', 'Fourth-year IT student at Tunis Business School. Backend & AI developer seeking a 2027 graduation internship (PFE).')}</p>
            </div>

            <div class="footer-col">
              <h4>${t('footer.nav_heading', 'Navigation')}</h4>
              <ul class="footer-links">
                <li><a href="/" data-link class="footer-link">${t('footer.main_portfolio', 'Main Portfolio')}</a></li>
                <li><a href="/side-quests" data-link class="footer-link">${t('footer.side_quests', 'Side Quests')}</a></li>
                <li><a href="/writing" data-link class="footer-link">${t('footer.writing_archive', 'Writing Archive')}</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>${t('footer.cv_heading', 'Curriculum Vitae')}</h4>
              <ul class="footer-links">
                <li><a href="/apis/get_cv?lang=en" class="footer-link" target="_blank" rel="noopener">${t('footer.see_cv_en', t('footer.download_cv_en', 'See CV (English) ↗'))}</a></li>
                <li><a href="/apis/get_cv?lang=fr" class="footer-link" target="_blank" rel="noopener">${t('footer.see_cv_fr', t('footer.download_cv_fr', 'See CV (French) ↗'))}</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>
              <span>© ${new Date().getFullYear()} Oussama Zmitri. ${t('footer.copyright', 'All rights reserved.')}</span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <span>${t('footer.mode', 'Mode:')} <strong style="color: var(--text-heading);">${state.template.toUpperCase()}</strong></span>
              <span>•</span>
              <span>${t('footer.theme', 'Theme:')} <strong style="color: var(--text-heading);">${state.theme.toUpperCase()}</strong></span>
              <span>•</span>
              <span>${state.language.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </footer>

      <!-- Floating Back to Top Button -->
      <button type="button" class="back-to-top-btn" id="back-to-top-btn" aria-label="${t('site.back_to_top', 'Back to top')}" title="${t('site.back_to_top', 'Back to top')}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>

      <!-- Toast Container -->
      <div class="toast-container" id="toast-container"></div>
    `;

    // Ensure active router styles
    router.updateView();
  }

  async changeLanguage(targetLang) {
    const validTarget = (targetLang === 'fr') ? 'fr' : 'en';
    if (validTarget === state.language && this.profileData) return;

    state.setLanguage(validTarget);

    // 1. Load translations from backend
    const transOk = await setLanguage(validTarget);
    if (!transOk) {
      showToast(t('messages.fetch_error', 'Could not load translations.'));
      return;
    }

    // 2. Fetch corresponding localized profile data
    const profileResult = await fetchProfileData(validTarget);
    if (profileResult.success) {
      this.profileData = profileResult.data;
    }

    // 3. Update document title via router
    router.updateTitle();

    // 4. Re-render Layout chrome (nav links, labels, footer)
    this.renderLayout();
    this.setupControlsHandlers();

    // 5. Re-render current main view (Normal, DevMode, or Matrix) preserving scroll position
    this.renderCurrentView(true);

    // 6. User feedback toast notification in new language
    showToast(t('messages.language_changed', validTarget === 'fr' ? 'Langue changée en français' : 'Language switched to English'));
  }

  renderCurrentView(preserveScroll = false) {
    if (!this.profileData) return;

    const scrollY = window.scrollY;
    const viewContainer = document.getElementById('view-root');
    if (!viewContainer) return;

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
    if (!viewContainer) return;

    viewContainer.innerHTML = `
      <div class="container" style="padding: 6rem 1rem; text-align: center;">
        <div style="background-color: var(--bg-card); border: 1px solid #ef4444; border-radius: var(--radius-md); padding: 3rem 2rem; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444; font-size: 1.5rem; margin-bottom: 0.75rem;">${t('messages.error_title', 'Backend Connection Notice')}</h2>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${errorMessage}</p>
          <button type="button" class="btn btn-primary" id="retry-fetch-btn">
            ${t('messages.retry', 'Retry Connection')}
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
    // Language Switcher Buttons
    const langButtons = document.querySelectorAll('[data-lang-btn]');
    langButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetLang = btn.dataset.langBtn;
        this.closeMobileMenu();
        this.changeLanguage(targetLang);
      });
    });

    // Template Switcher Buttons
    const templateButtons = document.querySelectorAll('[data-template-btn]');
    templateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTemplate = btn.dataset.templateBtn;
        this.closeMobileMenu();
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

    // Floating Back to Top Button Handler
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      let scrollTicking = false;
      window.addEventListener('scroll', () => {
        if (!scrollTicking) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > 300) {
              backToTopBtn.classList.add('visible');
            } else {
              backToTopBtn.classList.remove('visible');
            }
            scrollTicking = false;
          });
          scrollTicking = true;
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Attach Section Smooth Scroll Handlers
    this.setupSectionLinkHandlers();
  }

  setupSectionLinkHandlers() {
    document.querySelectorAll('.nav-section-link').forEach(link => {
      link.onclick = (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          this.closeMobileMenu();
          const targetId = href.slice(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            const navEl = document.querySelector('.site-nav');
            const offset = (navEl ? navEl.offsetHeight : 70) + 16;
            const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
            history.pushState(null, '', href);
          }
        }
      };
    });

    document.querySelectorAll('.dev-file-link').forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        this.closeMobileMenu();
        const fileId = link.dataset.devFile;
        if (fileId) {
          switchDevModeFile(fileId);
          const ideWindow = document.querySelector('.ide-window');
          if (ideWindow) {
            const navEl = document.querySelector('.site-nav');
            const offset = (navEl ? navEl.offsetHeight : 70) + 16;
            const targetPos = ideWindow.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        }
      };
    });
  }

  updateControlsUI() {
    // Update language buttons
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const isSelected = btn.dataset.langBtn === state.language;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));
    });

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

// Global Toast notification helper
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
