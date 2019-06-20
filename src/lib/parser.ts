import * as ev from 'express-validation';

import { ApiError, ValidationError } from './errors';
import { errors } from '../config/errors.config';
import { errorDefaults } from '../config/defaults.config';
import { getTranslator } from './translator';

/**
 * Parse errors
 * @param {String} error
 * @param {Object} translatorOptions
 */
export function parseErrors(error: any, translatorOptions?: TranslatorOptions) {
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
    let translatedMessage = error.message;

    if (translatorOptions) {
      const translator = getTranslator(translatorOptions.path, translatorOptions.defaultLocale);
      try {
        translatedMessage = translator.translate(error.i18n);
      } catch (_error) {
        // If language file was not found set text to default message
        translatedMessage = error.message;
      }

      // if the translatedMessage equals the error code OR is undefined because not found
      // fallback to default error message from errors
      if (translatedMessage === error.i18n || translatedMessage == null) {
        translatedMessage = error.message;
      }
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

// Interfaces
export interface TranslatorOptions {
  path: string;
  defaultLocale?: string;
  language?: string;
}
