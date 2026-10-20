/**
 * Centralized State Management
 * Handles Theme (light/dark), Template (normal/devmode/matrix), and Language (en/fr)
 * Supports persistence in localStorage, system preference detection, and event broadcasting
 */

const STORAGE_KEYS = {
  THEME: 'portfolio_theme',
  TEMPLATE: 'portfolio_template',
  MATRIX_RAIN: 'portfolio_matrix_rain',
  LANGUAGE: 'portfolio_language'
};

class PortfolioState {
  constructor() {
    this.theme = this.getInitialTheme();
    this.template = this.getInitialTemplate();
    this.language = this.getInitialLanguage();
    this.matrixRain = localStorage.getItem(STORAGE_KEYS.MATRIX_RAIN) !== 'false';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.listeners = [];

    // Apply initial attributes to DOM
    this.applyToDOM();

    // Listen for system theme changes if user hasn't explicitly set one
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  getInitialTemplate() {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATE);
    if (['normal', 'devmode', 'matrix'].includes(saved)) return saved;
    return 'normal';
  }

  getInitialLanguage() {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved === 'en' || saved === 'fr') return saved;
    // Default to English as authoritative default
    return 'en';
  }

  setTheme(newTheme, persist = true) {
    if (this.theme === newTheme) return;
    this.theme = newTheme;
    if (persist) {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    }
    this.applyToDOM();
    this.notify();
  }

  toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  setTemplate(newTemplate) {
    if (this.template === newTemplate) return;
    const oldTemplate = this.template;
    this.template = newTemplate;
    localStorage.setItem(STORAGE_KEYS.TEMPLATE, newTemplate);

    // Rule: Matrix defaults to Dark when first selected if user hasn't set an explicit preference
    if (newTemplate === 'matrix' && oldTemplate !== 'matrix') {
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        this.setTheme('dark', false);
      }
    }

    this.applyToDOM();
    this.notify();
  }

  setLanguage(newLang, persist = true) {
    const validLang = (newLang === 'fr') ? 'fr' : 'en';
    if (this.language === validLang) return;
    this.language = validLang;
    if (persist) {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, validLang);
    }
    this.applyToDOM();
    this.notify();
  }

  setMatrixRain(active) {
    this.matrixRain = active;
    localStorage.setItem(STORAGE_KEYS.MATRIX_RAIN, String(active));
    this.notify();
  }

  applyToDOM() {
    document.documentElement.setAttribute('data-template', this.template);
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.setAttribute('lang', this.language);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }
}

export const state = new PortfolioState();
