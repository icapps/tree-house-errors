import { importTranslations } from '../src';
import * as icappsTranslation from 'icapps-translations';
import { existsSync, rmdirSync, mkdirSync } from 'fs';

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
    rmdirSync('./locales'); // cleanup
  });

  it('should use the existing locales directory', async () => {
    const newDestination = './tests/locales';
    mkdirSync(newDestination);
    expect(existsSync(newDestination)).toEqual(true);

    await importTranslations('randomToken', { destination: newDestination });
    expect(icappsTranslationMock).toHaveBeenCalledTimes(1);

    // cleanup
    rmdirSync(newDestination);
  });

  it('should create the locales directory if not exists', async () => {
    const newDestination = './tests/locales';

    await importTranslations('randomToken', { destination: newDestination });
    expect(icappsTranslationMock).toHaveBeenCalledTimes(1);
    expect(existsSync(newDestination)).toEqual(true);

    // cleanup
    rmdirSync(newDestination);
  });
});
