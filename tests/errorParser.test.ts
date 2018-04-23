import * as httpStatus from 'http-status';
import { ValidationError } from 'express-validation';
import { parseErrors, ApiError, errors } from '../src';
import { errorDefaults } from '../src/lib/constants';
import * as i18n from 'i18n';

describe('errorParser', () => {
  const defaultError = new ApiError(errorDefaults.DEFAULT_HTTP_CODE, errorDefaults.DEFAULT_ERROR);
  let i18nMock;

  beforeEach(() => {
    i18nMock = jest.spyOn(i18n, '__');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Unkown errors', () => {
    it('Should return the default error when unknown object is passed', () => {
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
    it('Should succesfully parse default ApiError', () => {
      const errorTranslation = 'English translation';
      i18nMock.mockImplementation(() => errorTranslation);

      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err, 'en');
        expect(parsedError).toMatchObject({
          id: expect.any(String),
          status: httpStatus.BAD_REQUEST,
          code: errors.INVALID_INPUT.code,
          title: errorTranslation,
          detail: errorTranslation,
        });
      }
    });
    it('Should succesfully parse default ApiError with default message when language is not available', () => {
      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err, 'du');
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
      i18nMock.mockImplementation(() => errorTranslation);

      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (err) {
        const parsedError = parseErrors(err, 'nl');
        expect(parsedError).toMatchObject({
          id: expect.any(String),
          status: httpStatus.BAD_REQUEST,
          code: errors.INVALID_INPUT.code,
          title: errorTranslation,
          detail: errorTranslation,
        });
      }
    });

    // TODO: Custom cases
  });
});
