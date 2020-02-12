import * as uuid from 'uuid';
import * as httpStatus from 'http-status';

import { errors } from '../config/errors.config';

export class ApiError extends Error {
  code: string;
  status: number;
  i18n?: string;
  id?: string;
  detail?: any;
  isApiError: boolean;

  constructor(status: number, error: ErrorType, args: { message?: string, detail?: any, stack?: any } = {}) {
    const { message, detail, stack } = args;
    super(message || error.message);
    this.name = 'ApiError';
    this.isApiError = true;
    this.id = uuid.v1();
    this.code = error.code;
    this.i18n = error.i18n;
    this.status = status;
    this.detail = detail;
    if (stack) this.stack = stack;
  }
}

export class GenericError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(0, error == null ? errors.GENERIC_ERROR : error, args);
    this.name = 'GenericError';
  }
}

export class BadRequestError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(httpStatus.BAD_REQUEST, error == null ? errors.BAD_REQUEST : error, args);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(httpStatus.NOT_FOUND, error == null ? errors.RESOURCE_NOT_FOUND : error, args);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(httpStatus.FORBIDDEN, error == null ? errors.FORBIDDEN : error, args);
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(httpStatus.INTERNAL_SERVER_ERROR, error == null ? errors.INTERNAL_ERROR : error, args);
    this.name = 'InternalServerError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(httpStatus.UNAUTHORIZED, error == null ? errors.UNAUTHORIZED : error, args);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(httpStatus.BAD_REQUEST, error == null ? errors.INVALID_INPUT : error, args);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(error?: ErrorType, args?: ErrorArgs) {
    super(httpStatus.BAD_REQUEST, error == null ? errors.AUTHENTICATION_FAILED : error, args);
    this.name = 'AuthenticationError';
  }
}

// Type definitions
export interface ErrorType {
  code: string;
  message: string;
  i18n?: string;
}

export interface ErrorArgs {
  message?: string;
  status?: number;
  detail?: any;
  stack?: any;
}
