import * as ev from 'express-validation';
import { ApiError, ValidationError } from './errors';
import { errorConfig as errors } from './errorConfig';
import { errorDefaults } from './constants';

export function parseErrors(error: any) {
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
    parsedError = error;
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
