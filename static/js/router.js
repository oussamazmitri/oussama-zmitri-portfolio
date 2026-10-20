/**
 * Client-Side Router
 * Handles navigation between /, /side-quests, and /writing
 * Supports pushState, popstate, link hijacking, and localized page titles
 */

import { t } from './i18n.js';

class Router {
  constructor() {
    this.validRoutes = ['/', '/side-quests', '/writing'];
    this.currentPath = this.normalizePath(window.location.pathname);
    this.routeListeners = [];

    // Intercept click on data-link elements
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });

    // Listen for browser forward/back
    window.addEventListener('popstate', () => {
      this.currentPath = this.normalizePath(window.location.pathname);
      this.updateView();
    });
  }

  normalizePath(path) {
    if (!path || path === '') return '/';
    const clean = path.replace(/\/+$/, '') || '/';
    return this.validRoutes.includes(clean) ? clean : '/';
  }

  getTitleForPath(path) {
    if (path === '/side-quests') {
      return t('routes.side_quests_title', 'Side Quests & Experiments | Oussama Zmitri');
    }
    if (path === '/writing') {
      return t('routes.writing_title', 'Writing & Notes | Oussama Zmitri');
    }
    return t('routes.home_title', 'Oussama Zmitri | Backend & AI Developer');
  }

  navigate(url) {
    const targetPath = this.normalizePath(url);
    if (targetPath === this.currentPath && window.location.pathname === targetPath) return;

    window.history.pushState(null, '', targetPath);
    this.currentPath = targetPath;
    this.updateView();
  }

  updateTitle() {
    document.title = this.getTitleForPath(this.currentPath);
  }

  updateView() {
    this.updateTitle();

    // Update active nav links in desktop and mobile menu
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (this.normalizePath(href) === this.currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Notify listeners
    this.routeListeners.forEach(fn => fn(this.currentPath));
  }

  subscribe(listener) {
    this.routeListeners.push(listener);
    return () => {
      this.routeListeners = this.routeListeners.filter(l => l !== listener);
    };
  }

  getCurrentPath() {
    return this.currentPath;
  }
}

export const router = new Router();
