import { importTranslations } from '../src';
import * as icappsTranslation from 'icapps-translations';
import { existsSync, rmdirSync } from 'fs';

describe('importTranslations', () => {
  let icappsTranslationMock;

  beforeEach(() => {
    icappsTranslationMock = jest.spyOn(icappsTranslation, 'import').mockImplementation(() => { });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should import the translations', async () => {
    await importTranslations('randomToken');
    expect(icappsTranslationMock).toHaveBeenCalledTimes(1);
  });

  it('should create the locales directory if not exists', async () => {
    const newDestination = './tests/locales';

    await importTranslations('randomToken', { destination: newDestination });
    expect(icappsTranslationMock).toHaveBeenCalledTimes(1);
    expect(await existsSync(newDestination)).toEqual(true);

    // cleanup
    await rmdirSync(newDestination);
  });
});
