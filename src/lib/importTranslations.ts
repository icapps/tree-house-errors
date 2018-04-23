import * as icappsTranslation from 'icapps-translations';

const url = '';
const defaultOptions = {
  destination: './lib/locales',
};

export function importTranslations(token: string, options?: TranslationOptions) {
  const allOptions = Object.assign({}, defaultOptions, options);
  return icappsTranslation.import(url, token, allOptions);
}

export interface TranslationOptions {
  destination?: string;
  clean?: boolean;
  verbose?: boolean;
  seperateCategories?: boolean;
  exportType?: string;
}
