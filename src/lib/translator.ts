import * as i18n from 'i18n';

const translator: any = {};

/**
 * Return singleton i18n instance
 */
export function getTranslator(path: string, defaultLocale?: string) {
  if (Object.keys(translator).length === 0) {
    i18n.configure({
      directory: path,
      defaultLocale: defaultLocale || 'en',
      updateFiles: false,
      register: translator,
    });
  }
  return translator;
}
