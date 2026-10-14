/**
 * API Service for Portfolio Data
 * Fetches from /apis/get_overall (and /apis/get_overview fallback)
 * Caches in memory to avoid duplicate fetches
 */

let cachedProfileData = null;

export async function fetchProfileData() {
  if (cachedProfileData) {
    return { success: true, data: cachedProfileData };
  }

  // Try /apis/get_overall first, fallback to /apis/get_overview
  const endpoints = ['/apis/get_overall', '/apis/get_overview'];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        cachedProfileData = data;
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

export function getCachedProfileData() {
  return cachedProfileData;
}
