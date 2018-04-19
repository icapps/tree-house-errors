import * as fs from 'fs';
import { importTranslations } from '../src';
import * as icappsTranslation from 'icapps-translations';

describe('importTranslations', () => {
  const mock = jest.spyOn(icappsTranslation, 'import').mockImplementation(() => { });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should import the translations', async () => {
    await importTranslations('randomToken');
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
