import * as translator from '../src/lib/translator';
import * as i18n from 'i18n';

describe('translator', () => {
  const i18nSpy = jest.spyOn(i18n, 'configure');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTranslator', () => {
    it('Should configure i18n and return instance after first time', () => {
      const result = translator.getTranslator('/');
      translator.getTranslator('/'); // translator is a singleton, so getTranslator should still be haveBeenCalledTimes = 1
      expect(result).toHaveProperty('__');
      expect(result).toHaveProperty('setLocale');
      expect(i18nSpy).toHaveBeenCalledTimes(1);
    });
  });
});
