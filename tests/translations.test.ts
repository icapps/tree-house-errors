import * as fs from 'fs';
import { importTranslations } from '../src';
import * as icappsTranslation from 'icapps-translations';

describe('importTranslations', () => {
  const icappsTranslationMock = jest.spyOn(icappsTranslation, 'import').mockImplementation(() => { });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should import the translations', async () => {
    await importTranslations('randomToken');
    expect(icappsTranslationMock).toHaveBeenCalledTimes(1);
  });
});
