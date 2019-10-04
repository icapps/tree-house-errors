import * as httpStatus from 'http-status';
import { ValidationError } from 'express-validation';

import * as translator from '../src/lib/translator';
import { ApiError, errors, parseErrors } from '../src';
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
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
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
        joi: {},
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
});
