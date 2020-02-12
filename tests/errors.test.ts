import * as httpStatus from 'http-status';
import {
  errors,
  ApiError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
  ValidationError,
  AuthenticationError,
  GenericError,
} from '../src';

describe('errors', () => {
  describe('ApiError', () => {
    it('Should throw an ApiError with default arguments', () => {
      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.name).toEqual('ApiError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`ApiError: ${errors.INVALID_INPUT.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an ApiError with custom arguments', () => {
      try {
        throw new ApiError(httpStatus.BAD_REQUEST, errors.INVALID_INPUT, {
          message: 'Error with a custom message',
          detail: {
            badFormatFields: {
              name: 'email',
            },
          },
          stack: 'Something went wrong for...',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.name).toEqual('ApiError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('ApiError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toEqual({ badFormatFields: { name: 'email' } });
      }
    });
  });

  describe('GenericError', () => {
    it('Should throw a GenericError with default arguments', () => {
      try {
        throw new GenericError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(GenericError);
        expect(error.name).toEqual('GenericError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`GenericError: ${errors.GENERIC_ERROR.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an InternalServerError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new GenericError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(GenericError);
        expect(error.name).toEqual('GenericError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('GenericError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });

  describe('BadRequestError', () => {
    it('Should throw an BadRequestError with default arguments', () => {
      try {
        throw new BadRequestError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.name).toEqual('BadRequestError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`BadRequestError: ${errors.BAD_REQUEST.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an BadRequestError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new BadRequestError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.name).toEqual('BadRequestError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('BadRequestError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });

  describe('NotFoundError', () => {
    it('Should throw an NotFoundError with default arguments', () => {
      try {
        throw new NotFoundError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.name).toEqual('NotFoundError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`NotFoundError: ${errors.RESOURCE_NOT_FOUND.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an NotFoundError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new NotFoundError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.name).toEqual('NotFoundError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('NotFoundError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });

  describe('ForbiddenError', () => {
    it('Should throw an ForbiddenError with default arguments', () => {
      try {
        throw new ForbiddenError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ForbiddenError);
        expect(error.name).toEqual('ForbiddenError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`ForbiddenError: ${errors.FORBIDDEN.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an ForbiddenError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new ForbiddenError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ForbiddenError);
        expect(error.name).toEqual('ForbiddenError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('ForbiddenError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });

  describe('InternalServerError', () => {
    it('Should throw an InternalServerError with default arguments', () => {
      try {
        throw new InternalServerError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(InternalServerError);
        expect(error.name).toEqual('InternalServerError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`InternalServerError: ${errors.INTERNAL_ERROR.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an InternalServerError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new InternalServerError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(InternalServerError);
        expect(error.name).toEqual('InternalServerError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('InternalServerError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });

  describe('UnauthorizedError', () => {
    it('Should throw an UnauthorizedError with default arguments', () => {
      try {
        throw new UnauthorizedError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(UnauthorizedError);
        expect(error.name).toEqual('UnauthorizedError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`UnauthorizedError: ${errors.UNAUTHORIZED.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an UnauthorizedError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new UnauthorizedError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(UnauthorizedError);
        expect(error.name).toEqual('UnauthorizedError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('UnauthorizedError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });

  describe('ValidationError', () => {
    it('Should throw an ValidationError with default arguments', () => {
      try {
        throw new ValidationError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.name).toEqual('ValidationError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`ValidationError: ${errors.INVALID_INPUT.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an ValidationError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new ValidationError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.name).toEqual('ValidationError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('ValidationError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });

  describe('AuthenticationError', () => {
    it('Should throw an ValidationError with default arguments', () => {
      try {
        throw new AuthenticationError();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AuthenticationError);
        expect(error.name).toEqual('AuthenticationError');
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual(`AuthenticationError: ${errors.AUTHENTICATION_FAILED.message}`);
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });

    it('Should throw an ValidationError with custom error', () => {
      const args = {
        code: 'CUSTOM_CODE',
        message: 'Error with a custom message',
      };

      try {
        throw new AuthenticationError(args);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AuthenticationError);
        expect(error.name).toEqual('AuthenticationError');
        expect(error.code).toEqual(args.code);
        expect(error.id).toEqual(expect.any(String));
        expect(error.toString()).toEqual('AuthenticationError: Error with a custom message');
        expect(error.stack).not.toBeNull();
        expect(error.detail).toBeUndefined();
      }
    });
  });
});
