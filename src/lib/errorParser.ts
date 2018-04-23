import * as ev from 'express-validation';
import { ApiError, ValidationError } from './errors';
import { errorConfig as errors } from './errorConfig';
import { errorDefaults } from './constants';
import i18n from './i18nConfig';

export function parseErrors(error: any, language?: string) {
  const metaData: any = {};
  let parsedError = new ApiError(errorDefaults.DEFAULT_HTTP_CODE, errorDefaults.DEFAULT_ERROR); // Default error

  // Other errors
  if (error instanceof Error) {
    Object.assign(metaData, { stack: JSON.stringify(error.stack) });
    if (error.hasOwnProperty('schema') && error.hasOwnProperty('detail')) { // knex.js specific errors
      const errorData = <any>error;
      Object.assign(metaData, errorData);
    }
  }

  // Express middleware validation errors
  if (error instanceof ev.ValidationError) {
    parsedError = new ValidationError(errors.INVALID_INPUT, {
      detail: error.errors,
    });
  }

  // Own thrown ApiErrors
  if (error instanceof ApiError) {
    i18n.setLocale(language);

    let translatedMessage = i18n.__(error.i18n);
    // if the translatedMessage equals the error code or is undefined
    // no translation is found
    // fallback to default error message from ErrorConfig
    if (translatedMessage === error.i18n || translatedMessage === undefined) {
      translatedMessage = error.message;
    }
    parsedError = Object.assign({}, error, { message: translatedMessage });
  }

  // Return object easy to use for serialisation
  return {
    id: parsedError.id,
    status: parsedError.status,
    code: parsedError.code,
    title: parsedError.message,
    detail: parsedError.detail || parsedError.message,
    meta: Object.keys(metaData).length !== 0 ? metaData : undefined,
  };
}
