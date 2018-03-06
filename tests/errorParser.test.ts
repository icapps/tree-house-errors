import { parseErrors, ApiError } from '../src';
import { errorDefaults } from '../src/lib/constants';

describe('errorParser', () => {
  const defaultError = new ApiError(errorDefaults.DEFAULT_HTTP_CODE, errorDefaults.DEFAULT_ERROR);

  describe('Unkown errors', () => {
    it('Should return the default error when unknown object is passed', () => {
      const parsedError = parseErrors({ myProp: 'iDunno' });
      expect(parsedError).toMatchObject({
        status: defaultError.status,
        code: defaultError.code,
        title: defaultError.message,
        detail: defaultError.message,
        stack: undefined, // At least add stacktrace for unknown errors
      });
    });
  });

  describe('Express Validation errors', () => {

  });

  describe('Predefined Api errors', () => {

  });
});
