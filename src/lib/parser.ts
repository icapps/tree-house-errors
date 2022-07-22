import * as _ from 'lodash';
import * as safeJsonStringify from 'safe-json-stringify';

import { ApiError, ValidationError, InternalServerError, ErrorType } from './errors';
import { errors } from '../config/errors.config';
import { errorDefaults } from '../config/defaults.config';
import { getTranslator } from './translator';

/**
 * Check if object has all required properties to be an ApiError
 * @param {Object} obj
 */
export const isJsonApiError = (obj: ParsedError | any = {}): obj is ParsedError =>
  _.has(obj, 'status') && _.has(obj, 'code') && _.has(obj, 'title') && _.has(obj, 'detail');

/**
 * Check if object is an ApiError instance
 * Optionally check whether it matches a specific error
 * @param err
 * @param type
 */
export const isApiError = (err: ApiError | any, type?: ErrorType): err is ApiError => {
  const isError = Object.getOwnPropertyDescriptor(err || {}, 'isApiError') && err.isApiError === true;

  if (isError) {
    if (!type) return true;
    return err.code === type.code;
  }

  return false;
};

/**
 * Parse errors
 * @param {String} error
 * @param {Object} translatorOptions
 */
export function parseErrors(error: any = {}, translatorOptions?: TranslatorOptions): ParsedError {
  const metaData: any = {};
  let parsedError = new ApiError(errorDefaults.DEFAULT_HTTP_CODE, errorDefaults.DEFAULT_ERROR); // Default error

  // Other errors
  if (error instanceof Error) {
    Object.assign(metaData, { stack: safeJsonStringify(error.stack) });

    if (Object.getOwnPropertyDescriptor(error, 'schema') && Object.getOwnPropertyDescriptor(error, 'detail')) {
      // knex.js specific errors
      const errorData = <any>error;
      Object.assign(metaData, errorData);
    }
  }

  // Express middleware validation errors
  if (error.name === 'ValidationError') {
    parsedError = new ValidationError(errors.INVALID_INPUT, {
      detail: error.details,
    });
  }

  // Celebrate middleware validation errors
  if (Object.getOwnPropertyDescriptor(error, 'joi')) {
    const { isJoi = false, details } = error.joi || {};
    if (isJoi) {
      parsedError = new ValidationError(errors.INVALID_INPUT, {
        detail: details,
      });
    }
  }

  // Own thrown ApiErrors
  if (isApiError(error)) {
    let translatedMessage = error.message;

    if (translatorOptions) {
      const translator = getTranslator(translatorOptions.path, translatorOptions.defaultLocale);
      try {
        translatedMessage = translator.translate(error.i18n, translatorOptions?.language);
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

/**
 * Parse json response containing errors into actual ApiError objects
 * @param {Object} response
 */
export function parseJsonErrors(response: any): ApiError[] {
  if (Object.getOwnPropertyDescriptor(response || {}, 'errors') && Array.isArray(response.errors)) {
    return response.errors.reduce((acc: ApiError[], error: ParsedError) => {
      if (isJsonApiError(error)) {
        const { status, code, title, detail, meta = {} } = error;
        return [...acc, new ApiError(status, { code, message: title }, { detail, stack: (meta || {}).stack })];
      }

      return acc;
    }, []);
  }

  // Make sure to always return ApiError
  return [new InternalServerError(errors.INTERNAL_ERROR, { detail: response })];
}

// Interfaces
export interface TranslatorOptions {
  path: string;
  defaultLocale?: string;
  language?: string;
}

export interface ParsedError {
  id: string;
  status: number;
  code: string;
  title: string;
  detail: any;
  meta: any | undefined;
}
