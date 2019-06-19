import * as icappsTranslation from 'tree-house-translations';

/**
 * Returns a translator object
 * @param {String} path
 * @param {String} [defaultLocale]
 */
export const getTranslator = (path: string, defaultLocale?: string) => icappsTranslation.initTranslator(path, defaultLocale);
