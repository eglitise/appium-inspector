/**
 * The '#local-polyfills' alias is defined in both Vite config files.
 * Since both files define different resolution paths,
 * they cannot be added to tsconfig and eslint configurations
 */

import {settings} from '#local-polyfills'; // eslint-disable-line import-x/no-unresolved

import {DEFAULT_SETTINGS} from '../shared/setting-defs.js';

/**
 * Retrieves the value for an Inspector setting.
 * @param {string} setting - The name of the setting to retrieve
 * @returns {Promise<any>} - The value of the setting
 */
export async function getSetting(setting) {
  if (await settings.has(setting)) {
    return await settings.get(setting);
  }
  return DEFAULT_SETTINGS[setting];
}

/**
 * Sets a value for an Inspector setting.
 * @param {string} setting - The name of the setting to set
 * @param {string} value - The value to set
 */
export async function setSetting(setting, value) {
  await settings.set(setting, value);
}

export {
  loadSessionFileIfOpened,
  localesPath,
  openLink,
  setTheme,
  updateLanguage,
} from '#local-polyfills'; // eslint-disable-line import-x/no-unresolved
