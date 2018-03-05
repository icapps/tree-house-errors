import * as ev from 'express-validation';
import { ErrorSerializer } from 'jsonade';
import { errors, ApiError, ValidationError } from './errors';
import { errorDefaults } from './constants';

export function handleErrors(error: any) {
  let parsedError = new ApiError(errorDefaults.DEFAULT_HTTP_CODE, errorDefaults.DEFAULT_ERROR); // Default error

  // Express middleware validation errors
  if (error instanceof ev.ValidationError) {
    parsedError = new ValidationError(errors.VALIDATION_ERROR, {
      detail: error.errors,
    });
  }

  // Own thrown ApiErrors
  if (error instanceof ApiError) {
    parsedError = error;
  }

  const serializerError = {
    status: parsedError.status,
    code: parsedError.code,
    title: parsedError.message,
    detail: parsedError.detail || parsedError.message,
    stack: undefined,
  };

  // Only log stacktrace when in debug mode
  if (process.env.LOG_LEVEL === 'debug' && parsedError instanceof Error) {
    serializerError.stack = parsedError.stack;
  }

  // Return and serialize the error output
  return ErrorSerializer.serialize([serializerError]);
}
