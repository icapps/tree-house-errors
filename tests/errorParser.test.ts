import * as httpStatus from 'http-status';
import { ValidationError } from 'express-validation';
import { parseErrors, ApiError, errors } from '../src';
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
        stack: undefined,
      });
    });

    // TODO: Other custom errors extending from Error
  });

  describe('Express Validation errors', () => {
    const options = {
      flatten: false,
      status: 400,
      statusText: 'Validation...',
    };

    const expressValidationError = new ValidationError([{ name: 'myField' }], options);
    const parsedError = parseErrors(expressValidationError);
    expect(parsedError).toMatchObject({
      status: httpStatus.BAD_REQUEST,
      code: errors.INVALID_INPUT.code,
      title: errors.INVALID_INPUT.message,
      detail: [{ name: 'myField' }],
    });
  });

  describe('Predefined Api errors', () => {
    it('Should succesfully parse default ApiError', () => {
      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err);
        expect(parsedError).toMatchObject({
          status: httpStatus.BAD_REQUEST,
          code: errors.INVALID_INPUT.code,
          title: errors.INVALID_INPUT.message,
          detail: errors.INVALID_INPUT.message,
        });
      }
    });

    // TODO: Custom cases
  });
});
