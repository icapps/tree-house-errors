import * as uuid from 'uuid';
import * as httpStatus from 'http-status';

// TODO: List of all common errors
export const errors = {
  UNKNOWN_ERROR:      { internal: 1000, code: 'UNKOWN_ERROR', message: 'An unkown error occurred' },
  VALIDATION_ERROR:   { internal: 1001, code: 'VALIDATION_ERROR', message: 'Validation error' },
};

export class ApiError extends Error {
  code: string;
  status: number;
  id?: string;
  detail?: string;

  constructor(status: number, error: ErrorType, args: { message?: string, detail?: any, stack?: any } = {}) {
    const { message, detail, stack } = args;
    super(message || error.message);
    this.name = 'ApiError';
    this.id = uuid();
    this.code = error.code;
    this.status = status;
    this.detail = detail;
    if (stack) this.stack = JSON.stringify(stack);
  }
}

export class BadRequestError extends ApiError {
  constructor(error: ErrorType, args?: ErrorArgs) {
    super(httpStatus.BAD_REQUEST, error, args);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends ApiError {
  constructor(error: ErrorType, args?: ErrorArgs) {
    super(httpStatus.NOT_FOUND, error, args);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(error: ErrorType, args?: ErrorArgs) {
    super(httpStatus.FORBIDDEN, error, args);
    this.name = 'ForbiddenError';
  }
}

export class InternalServerError extends ApiError {
  constructor(error: ErrorType, args?: ErrorArgs) {
    super(httpStatus.INTERNAL_SERVER_ERROR, error, args);
    this.name = 'InternalServerError';
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(error: ErrorType, args?: ErrorArgs) {
    super(httpStatus.SERVICE_UNAVAILABLE, error, args);
    this.name = 'ServiceUnavailableError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(error: ErrorType, args?: ErrorArgs) {
    super(httpStatus.UNAUTHORIZED, error, args);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends ApiError {
  constructor(error: ErrorType, args?: ErrorArgs) {
    super(httpStatus.BAD_REQUEST, error, args);
    this.name = 'ValidationError';
  }
}

// Type definitions
export interface ErrorType {
  code: string;
  message: string;
}

export interface ErrorArgs {
  message?: string;
  status?: number;
  detail?: any;
  stack?: any;
}
