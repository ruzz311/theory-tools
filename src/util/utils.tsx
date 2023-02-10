/**
 * Simple wrapper to get a value from sessionStorage and cast it to a number.
 * 
 * @param key 
 * @param defaultValue 
 * @returns 
 */
export function getSessionStoreNumber(key: string, defaultValue = 0) {
  return Number(sessionStorage.getItem(key) || defaultValue);
}
