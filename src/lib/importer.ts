import * as icappsTranslation from 'icapps-translations';
import { existsSync, mkdirSync } from 'fs';

const url = '';
const defaultOptions = {
  destination: process.cwd() + '/locales',
};

export async function importTranslations(token: string, options?: TranslationOptions) {
  const allOptions = Object.assign({}, defaultOptions, options);
  // if locales location does not exists, make directory
  if (!await existsSync(allOptions.destination)) {
    await mkdirSync(allOptions.destination);
  }

  return icappsTranslation.import(url, token, allOptions);
}

export interface TranslationOptions {
  destination?: string;
  clean?: boolean;
  verbose?: boolean;
  seperateCategories?: boolean;
  exportType?: string;
}
