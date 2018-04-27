import * as i18n from 'i18n';

const translator: any = {};

i18n.configure({
  directory: process.cwd() + '/locales',
  defaultLocale: 'en',
  updateFiles: false,
  register: translator,
});

export { translator };
