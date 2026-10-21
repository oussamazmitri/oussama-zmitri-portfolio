/**
 * Centralized State Management
 * Handles Theme (light/dark), Template (normal/devmode/matrix), and Language (en/fr)
 * Supports persistence in localStorage, system preference detection, and event broadcasting
 */

const STORAGE_KEYS = {
  THEME_PREFIX: 'portfolio_theme_',
  THEME: 'portfolio_theme',
  TEMPLATE: 'portfolio_template',
  MATRIX_RAIN: 'portfolio_matrix_rain',
  LANGUAGE: 'portfolio_language'
};

class PortfolioState {
  constructor() {
    this.template = this.getInitialTemplate();
    this.theme = this.getThemeForTemplate(this.template);
    this.language = this.getInitialLanguage();
    this.matrixRain = localStorage.getItem(STORAGE_KEYS.MATRIX_RAIN) !== 'false';
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.listeners = [];

    // Apply initial attributes to DOM
    this.applyToDOM();

    // Listen for system theme changes if user hasn't explicitly set one for current template
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const savedForTemplate = localStorage.getItem(`${STORAGE_KEYS.THEME_PREFIX}${this.template}`);
      if (!savedForTemplate && this.template === 'normal') {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  getInitialTemplate() {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATE);
    if (['normal', 'devmode', 'matrix'].includes(saved)) return saved;
    return 'normal';
  }

  getThemeForTemplate(template) {
    const savedForTemplate = localStorage.getItem(`${STORAGE_KEYS.THEME_PREFIX}${template}`);
    if (savedForTemplate === 'light' || savedForTemplate === 'dark') {
      return savedForTemplate;
    }
    // Dev mode and Matrix mode must default to dark even if user set light in normal mode
    if (template === 'devmode' || template === 'matrix') {
      return 'dark';
    }
    // Normal mode defaults to light (or saved global preference)
    const savedGlobal = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedGlobal === 'light' || savedGlobal === 'dark') {
      return savedGlobal;
    }
    return 'light';
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
      localStorage.setItem(`${STORAGE_KEYS.THEME_PREFIX}${this.template}`, newTheme);
      if (this.template === 'normal') {
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      }
    }
    this.applyToDOM();
    this.notify();
  }

  toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  setTemplate(newTemplate) {
    if (this.template === newTemplate) return;
    this.template = newTemplate;
    localStorage.setItem(STORAGE_KEYS.TEMPLATE, newTemplate);

    // Apply template's default/saved theme (devmode & matrix default to dark even if user set light in normal)
    this.theme = this.getThemeForTemplate(newTemplate);

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
