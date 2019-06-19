import * as icappsTranslation from 'tree-house-translations';
import * as translator from '../src/lib/translator';

describe('translator', () => {
  const initTranslatorSpy = jest.spyOn(icappsTranslation, 'initTranslator').mockReturnValue({
    translate: jest.fn(),
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTranslator', () => {
    it('Should configure icapps translator', () => {
      const result = translator.getTranslator('/', 'en');
      expect(result).toHaveProperty('translate');
      expect(initTranslatorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
