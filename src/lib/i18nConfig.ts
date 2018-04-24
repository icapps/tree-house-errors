import * as i18n from 'i18n';

i18n.configure({
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  updateFiles: false,
});

export default i18n;
