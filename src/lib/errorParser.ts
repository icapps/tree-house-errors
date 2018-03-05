import * as ev from 'express-validation';
import { ApiError, ValidationError } from './errors';
import { errorConfig as errors } from './errorConfig';
import { errorDefaults } from './constants';

export function parseErrors(error: any) {
  let parsedError = new ApiError(errorDefaults.DEFAULT_HTTP_CODE, errorDefaults.DEFAULT_ERROR); // Default error

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
    status: parsedError.status,
    code: parsedError.code,
    title: parsedError.message,
    detail: parsedError.detail || parsedError.message,
    stack: error instanceof Error ? parsedError.stack : undefined, // At least add stacktrace for unknown errors
  };
}
