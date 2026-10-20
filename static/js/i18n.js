/**
 * Centralized Internationalization (i18n) Service
 * Manages translation dictionaries fetched from backend API (/apis/translations)
 * Provides keypath lookup helper t(keyPath, fallback), language switching, and caching
 */

import { fetchTranslations } from './api.js';

let currentLanguage = 'en';
const translationsCache = {};
const listeners = [];

/**
 * Initialize i18n system with preferred language
 */
export async function initI18n(lang = 'en') {
  currentLanguage = (lang === 'fr') ? 'fr' : 'en';
  return await loadLanguageTranslations(currentLanguage);
}

/**
 * Fetch and cache translations from backend API
 */
export async function loadLanguageTranslations(lang) {
  const normLang = (lang === 'fr') ? 'fr' : 'en';

  if (translationsCache[normLang]) {
    return { success: true, data: translationsCache[normLang] };
  }

  const result = await fetchTranslations(normLang);
  if (result.success && result.data) {
    // Normalise translation payload structure (support { translations: {...} } or root dictionary)
    const dict = result.data.translations || result.data;
    translationsCache[normLang] = dict;
    return { success: true, data: dict };
  }

  return { success: false, error: result.error || 'Failed to fetch translations' };
}

/**
 * Set active language, fetching translations if needed, and notifying subscribers
 */
export async function setLanguage(newLang) {
  const target = (newLang === 'fr') ? 'fr' : 'en';
  if (target === currentLanguage && translationsCache[target]) {
    return true;
  }

  const loadResult = await loadLanguageTranslations(target);
  if (loadResult.success) {
    currentLanguage = target;
    document.documentElement.setAttribute('lang', target);
    notifyListeners();
    return true;
  } else {
    console.error(`Could not switch language to ${target}:`, loadResult.error);
    return false;
  }
}

/**
 * Retrieve current active language code
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Retrieve current language translation dictionary
 */
export function getTranslations(lang = null) {
  const target = lang || currentLanguage;
  return translationsCache[target] || translationsCache['en'] || {};
}

/**
 * Translate a dot-delimited key path (e.g. 'nav.portfolio', 'hero.explore_work')
 * Falls back to English or provided fallback text if missing
 */
export function t(keyPath, fallback = '') {
  if (!keyPath || typeof keyPath !== 'string') return fallback || '';

  const dict = translationsCache[currentLanguage] || translationsCache['en'] || {};
  const enDict = translationsCache['en'] || {};

  let val = resolveKeyPath(dict, keyPath);
  if (val === undefined && currentLanguage !== 'en') {
    // Fall back to English dictionary for the missing key
    val = resolveKeyPath(enDict, keyPath);
  }

  return (val !== undefined && val !== null) ? val : (fallback || keyPath);
}

function resolveKeyPath(obj, path) {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Subscribe to language changes
 */
export function subscribeLanguage(listener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn(currentLanguage);
    } catch (e) {
      console.error('Error in language subscriber:', e);
    }
  });
}
