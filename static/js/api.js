/**
 * API Service for Portfolio Profile Data & Translations
 * Fetches from backend /apis endpoints with in-memory caching per language
 */

const profileCache = {};
const translationsCache = {};

/**
 * Fetch localized profile data (name, resume, projects, experiences, etc.)
 */
export async function fetchProfileData(lang = 'en') {
  const normLang = (lang === 'fr') ? 'fr' : 'en';

  if (profileCache[normLang]) {
    return { success: true, data: profileCache[normLang] };
  }

  const endpoints = [
    `/apis/get_overall?lang=${normLang}`,
    `/apis/get_overview?lang=${normLang}`,
    `/apis/get_overall`,
    `/apis/get_overview`
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        profileCache[normLang] = data;
        return { success: true, data };
      }
    } catch (err) {
      console.warn(`Attempt to fetch ${endpoint} failed:`, err);
    }
  }

  return {
    success: false,
    error: 'Could not load portfolio data. The server might be offline or starting up.'
  };
}

/**
 * Fetch interface translations dictionary from backend
 */
export async function fetchTranslations(lang = 'en') {
  const normLang = (lang === 'fr') ? 'fr' : 'en';

  if (translationsCache[normLang]) {
    return { success: true, data: translationsCache[normLang] };
  }

  const endpoints = [
    `/apis/translations?lang=${normLang}`,
    `/apis/get_translations?lang=${normLang}`,
    `/apis/translations/${normLang}`,
    `/apis/translations`
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        translationsCache[normLang] = data;
        return { success: true, data };
      }
    } catch (err) {
      console.warn(`Attempt to fetch translations from ${endpoint} failed:`, err);
    }
  }

  return {
    success: false,
    error: 'Could not load interface translations from the backend.'
  };
}

export function getCachedProfileData(lang = 'en') {
  const normLang = (lang === 'fr') ? 'fr' : 'en';
  return profileCache[normLang] || profileCache['en'] || null;
}
