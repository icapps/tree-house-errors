import * as icappsTranslation from 'icapps-translations';

const url = '';
const defaultOptions = {
  destination: './lib/locales',
};

export function importTranslations(token: string, options?: Options) {
  try {
    const allOptions = Object.assign({}, defaultOptions, options);
    return icappsTranslation.import(url, token, allOptions);
  } catch (ex) {
    throw ex;
  }
}

export interface Options {
  destination?: string;
  clean?: boolean;
  verbose?: boolean;
  seperateCategories?: boolean;
  exportType?: string;
}
