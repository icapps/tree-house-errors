import * as httpStatus from 'http-status';
import { ValidationError } from 'express-validation';

import * as translator from '../src/lib/translator';
import {
  ApiError, errors, parseErrors, parseJsonErrors, isJsonApiError, InternalServerError, BadRequestError, isApiError, UnauthorizedError,
  ForbiddenError,
} from '../src';
import { errorDefaults } from '../src/config/defaults.config';

describe('errorParser', () => {
  const defaultError = new ApiError(errorDefaults.DEFAULT_HTTP_CODE, errorDefaults.DEFAULT_ERROR);
  let translateMock;

  beforeEach(() => {
    translateMock = jest.fn(() => { });
    jest.spyOn(translator, 'getTranslator').mockImplementation(() => ({ translate: translateMock }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Unkown errors', () => {
    it('Should return the default error when unknown object is passed without translation', () => {
      const parsedError = parseErrors({ myProp: 'iDunno' });
      expect(parsedError).toMatchObject({
        id: expect.any(String),
        status: defaultError.status,
        code: defaultError.code,
        title: defaultError.message,
        detail: defaultError.message,
        meta: undefined,
      });
    });

    // TODO: Other custom errors extending from Error
  });

  describe('Knex.js errors', () => {
    const error = new Error('Some error...');
    Object.assign(error, { stack: 'myStack', detail: 'some details', schema: 'public' });

    const parsedError = parseErrors(error);
    expect(parsedError).toMatchObject({
      id: expect.any(String),
      status: defaultError.status,
      code: defaultError.code,
      title: defaultError.message,
      detail: defaultError.message,
      meta: {
        stack: JSON.stringify('myStack'),
        detail: 'some details',
        schema: 'public',
      },
    });
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
      id: expect.any(String),
      status: httpStatus.BAD_REQUEST,
      code: errors.INVALID_INPUT.code,
      title: errors.INVALID_INPUT.message,
      detail: [{ name: 'myField' }],
    });
  });

  describe('Predefined Api errors', () => {
    it('Should succesfully parse default ApiError with i18n', () => {
      const errorTranslation = 'English translation';
      translateMock.mockReturnValue(errorTranslation);

      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err, { path: '/', language: 'en' });
        expect(parsedError).toMatchObject({
          id: expect.any(String),
          status: httpStatus.BAD_REQUEST,
          code: errors.INVALID_INPUT.code,
          title: errorTranslation,
          detail: errorTranslation,
        });
      }

      expect(translateMock).toHaveBeenCalledTimes(1);
    });

    it('Should succesfully parse default ApiError without an i18n key', () => {
      expect.assertions(1);
      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err);
        expect(parsedError).toMatchObject({
          id: expect.any(String),
          status: httpStatus.BAD_REQUEST,
          code: errors.INVALID_INPUT.code,
          title: errors.INVALID_INPUT.message,
          detail: errors.INVALID_INPUT.message,
        });
      }
    });

    it('Should succesfully parse default ApiError with default message when language is not available', () => {
      expect.assertions(1);
      try {
        throw new BadRequestError(errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err, { path: '', language: 'du' });
        expect(parsedError).toMatchObject({
          id: expect.any(String),
          status: httpStatus.BAD_REQUEST,
          code: errors.INVALID_INPUT.code,
          title: errors.INVALID_INPUT.message,
          detail: errors.INVALID_INPUT.message,
        });
      }
    });

    it('Should succesfully parse default ApiError for Dutch translation', () => {
      const errorTranslation = 'Nederlands vertaling';
      translateMock.mockReturnValue(errorTranslation);

      expect.assertions(2);
      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err, { path: '', language: 'nl' });
        expect(parsedError).toMatchObject({
          id: expect.any(String),
          status: httpStatus.BAD_REQUEST,
          code: errors.INVALID_INPUT.code,
          title: errorTranslation,
          detail: errorTranslation,
        });
      }

      expect(translateMock).toHaveBeenCalledTimes(1);
    });

    it('Should use default message when translator throws an error', () => {
      translateMock.mockImplementation(() => { throw new Error('Error finding file'); });

      const parsedError = parseErrors(new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT), { path: '', language: 'du' });
      expect(parsedError).toMatchObject({
        id: expect.any(String),
        status: httpStatus.BAD_REQUEST,
        code: errors.INVALID_INPUT.code,
        title: errors.INVALID_INPUT.message,
        detail: errors.INVALID_INPUT.message,
      });
    });

    // TODO: Custom cases
  });

  describe('Celebrate errors', () => {
    it('Should parse celebrate joi error', () => {
      const celebrateError = {
        joi: {
          isJoi: true,
          details: 'Supercool details',
        },
      };

      const parsedError = parseErrors(celebrateError);
      expect(parsedError).toMatchObject({
        id: expect.any(String),
        status: httpStatus.BAD_REQUEST,
        code: errors.INVALID_INPUT.code,
        title: errors.INVALID_INPUT.message,
        detail: 'Supercool details',
      });
    });

    it('Should parse celebrate joi error without ValidationError', () => {
      const celebrateError = {
        joi: null,
      };

      const parsedError = parseErrors(celebrateError);
      expect(parsedError).toMatchObject({
        id: expect.any(String),
        status: defaultError.status,
        code: defaultError.code,
        title: defaultError.message,
        detail: defaultError.message,
        meta: undefined,
      });
    });
  });

  describe('isJsonApiError', () => {
    it('Should return true when all properties are available', () => {
      const output = isJsonApiError({
        status: httpStatus.BAD_REQUEST,
        code: 'RANDOM_CODE',
        title: 'My title',
        detail: {
          key: 'myValue',
        },
      });

      expect(output).toEqual(true);
    });

    it('Should return false when some properties are missing', () => {
      expect(isJsonApiError()).toEqual(false);
      expect(isJsonApiError({})).toEqual(false);
      expect(isJsonApiError({ status: httpStatus.NOT_ACCEPTABLE, code: '120', title: 'any Title' })).toEqual(false);
      expect(isJsonApiError({ status: httpStatus.INTERNAL_SERVER_ERROR, code: '120', detail: 'any Title' })).toEqual(false);
      expect(isJsonApiError({ code: '120', detail: 'any Title' })).toEqual(false);
      expect(isJsonApiError({ status: httpStatus.BAD_REQUEST, detail: 'any Title' })).toEqual(false);
    });
  });

  describe('isApiError', () => {
    it('Should return true when all properties are available', () => {
      expect(isApiError(new BadRequestError())).toEqual(true);
      expect(isApiError(new ApiError(401, errors.AUTHENTICATION_FAILED))).toEqual(true);
      expect(isApiError(new InternalServerError())).toEqual(true);
      expect(isApiError(new UnauthorizedError())).toEqual(true);
      expect(isApiError(new ForbiddenError())).toEqual(true);
    });

    it('Should return true when matches a specific error', () => {
      const errorType = { code: 'MY_ERROR', message: 'MY_MESSAGE' };
      const input = new BadRequestError(errorType);
      expect(isApiError(input, errorType)).toEqual(true);
    });

    it('Should return false when does not match a specific error', () => {
      const errorType = { code: 'MY_ERROR', message: 'MY_MESSAGE' };
      const input = new BadRequestError(errorType);
      expect(isApiError(input, { code: 'OTHER_CODE', message: 'MY_MESSAGE' })).toEqual(false);
    });

    it('Should return false when some properties are missing', () => {
      expect(isApiError({})).toEqual(false);
      expect(isApiError(null)).toEqual(false);
      expect(isApiError(new Error('SOMETHING WRONG'))).toEqual(false);
    });
  });

  describe('parseJsonErrors', () => {
    it('Should succesfully return parsed errors', () => {
      const result = parseJsonErrors({
        errors: [{
          status: httpStatus.BAD_REQUEST,
          code: 'MY_CODE',
          title: 'This is an error!',
          detail: { key: 'Value Mister' },
          meta: {
            stack: 'Something wrong',
          },
        },
        {}], // Should be filtered out
      });

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);

      expect(result[0]).toBeInstanceOf(ApiError);
      expect(result[0]).toMatchObject({
        id: expect.any(String),
        status: httpStatus.BAD_REQUEST,
        code: 'MY_CODE',
        message: 'This is an error!',
        detail: { key: 'Value Mister' },
        stack: 'Something wrong',
      });
    });

    it('Should succesfully return parsed errors with empty meta', () => {
      const result = parseJsonErrors({
        errors: [{
          status: httpStatus.BAD_REQUEST,
          code: 'MY_CODE',
          title: 'This is an error!',
          detail: { key: 'Value Mister' },
          meta: null,
        }],
      });

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);

      expect(result[0]).toBeInstanceOf(ApiError);
      expect(result[0]).toMatchObject({
        id: expect.any(String),
        status: httpStatus.BAD_REQUEST,
        code: 'MY_CODE',
        message: 'This is an error!',
        detail: { key: 'Value Mister' },
        stack: {},
      });
    });

    it('Should succesfully return parsed errors without meta', () => {
      const result = parseJsonErrors({
        errors: [{
          status: httpStatus.BAD_REQUEST,
          code: 'MY_CODE',
          title: 'This is an error!',
          detail: { key: 'Value Mister' },
        }],
      });

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);

      expect(result[0]).toBeInstanceOf(ApiError);
      expect(result[0]).toMatchObject({
        id: expect.any(String),
        status: httpStatus.BAD_REQUEST,
        code: 'MY_CODE',
        message: 'This is an error!',
        detail: { key: 'Value Mister' },
        stack: {},
      });
    });

    it('Should return internalServerError response when contains no errors', () => {
      expect(parseJsonErrors(null)[0]).toBeInstanceOf(InternalServerError);
      expect(parseJsonErrors([])[0]).toBeInstanceOf(InternalServerError);
      expect(parseJsonErrors({ errors: [] })).toEqual([]);
    });

    it('Should return empty error when not all properties were found', () => {
      const result = parseJsonErrors({
        errors: [{
          status: httpStatus.BAD_REQUEST,
          detail: { key: 'Value Mister' },
          meta: {
            stack: 'Something wrong',
          },
        }],
      });

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
  });
});
