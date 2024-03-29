# Treehouse errors

Custom NodeJS error classes and definitions with an error parser utility function

[![npm version](https://badge.fury.io/js/tree-house-errors.svg)](https://badge.fury.io/js/tree-house-errors)
[![Dependencies](https://david-dm.org/icapps/tree-house-errors.svg)](https://david-dm.org/icapps/tree-house-errors.svg)
[![Build Status](https://travis-ci.com/icapps/tree-house-errors.svg?branch=master)](https://travis-ci.com/icapps/tree-house-errors)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house-errors/badge.svg)](https://coveralls.io/github/icapps/tree-house-errors) [![Greenkeeper badge](https://badges.greenkeeper.io/icapps/tree-house-errors.svg)](https://greenkeeper.io/)

## Installation

Install via npm

```shell
npm install @icapps/tree-house-errors
```

or via yarn

```shell
yarn add @icapps/tree-house-errors
```

## Error types

### ApiError<T>

Base error class which extends from the `Error` class.
`ApiError` accepts a generic `T` for the `details` property; if not specified, it defaults to `any`.

```javascript
// All keys are required
const error = {
  code: 'BAD_REQUEST_DUE_TO',
  message: 'This is a bad request',
}

// All keys are optional
const optionalArgs = {
  message: 'Overwrite the message for custom error',
  detail: 'Extra details containing pertinent information',
  stack: 'stacktrace...',
}

throw new ApiError(400, error, optionalArgs);
```

### GenericError

Extends from ApiError with a preset of status code 0 and GENERIC_ERROR as error.
This should be used when it's internal without needing an actual status code.

```javascript
throw new GenericError(); // or
throw new GenericError(error, optionalArgs);
```

### BadRequestError

Extends from ApiError with a preset of status code 400 and BAD_REQUEST as error.

```javascript
throw new BadRequestError(); // or
throw new BadRequestError(error, optionalArgs);
```

### NotFoundError

Extends from ApiError with a preset of status code 404 and RESOURCE_NOT_FOUND as error.

```javascript
throw new NotFoundError(); // or
throw new NotFoundError(error, optionalArgs);
```

### ForbiddenError

Extends from ApiError with a preset of status code 403 and FORBIDDEN as error.

```javascript
throw new ForbiddenError(); // or
throw new ForbiddenError(error, optionalArgs);
```

### InternalServerError

Extends from ApiError with a preset of status code 500 and INTERNAL_ERROR as error.

```javascript
throw new InternalServerError(); // or
throw new InternalServerError(error, optionalArgs);
```

### UnauthorizedError

Extends from ApiError with a preset of status code 401 and UNAUTHORIZED as error.

```javascript
throw new UnauthorizedError(); // or
throw new UnauthorizedError(error, optionalArgs);
```

### ValidationError

Extends from ApiError with a preset of status code 400 and INVALID_INPUT as error.

```javascript
throw new ValidationError(); // or
throw new ValidationError(error, optionalArgs);
```

### AuthenticationError

Extends from ApiError with a preset of status code 400 and AUTHENTICATION_FAILED as error.

```javascript
throw new AuthenticationError(); // or
throw new AuthenticationError(error, optionalArgs);
```

## Error definitions

Predefined error types that can be used over multiple projects with a message and code per type. The current list provides following errors:

```javascript
INTERNAL_ERROR:         { code: 'INTERNAL_ERROR',i18n: 'internal_error',message: 'An unkown error occurred' },
INVALID_INPUT:          { code: 'INVALID_INPUT', i18n: 'invalid_input', message: 'Invalid input provided' },
AUTHENTICATION_FAILED:  { code: 'AUTHENTICATION_FAILED', i18n: 'authentication_failed', message: 'Authentication failed' },
BAD_REQUEST:            { code: 'BAD_REQUEST', i18n: 'bad_request', message: 'Bad request' },
MISSING_HEADERS:        { code: 'MISSING_HEADERS', i18n: 'missing_headers', message: 'Missing headers' },
UNAUTHORIZED:           { code: 'UNAUTHORIZED', i18n: 'unauthorized', message: 'Unauthorized' },
FORBIDDEN:              { code: 'FORBIDDEN', i18n: 'forbidden', message: 'No access' },
RESOURCE_NOT_FOUND:     { code: 'RESOURCE_NOT_FOUND', i18n: 'resource_not_found', message: 'Resource not found' },
```

Example

```javascript
import { errorConfig as errors } from '@icapps/tree-house-errors'
throw new ApiError(400, errors.BAD_REQUEST);
```

## Error parsing

### isApiError(apiError, type?)

Will return boolean indicating whether error is instance of `ApiError`.
Can also be used to provide an extra check matching a specific error type (will only match code, not message)

```javascript
  // Will return true
  isApiError(new BadRequestError())

  // Will return false
  isApiError(new Error('Something'))

  // Will return true
  isApiError(new BadRequestError(errors.MY_CUSTOM_ERROR), errors.MY_CUSTOM_ERROR)
```

> Will automatically cast to ApiError if succeeds and using Typescript

### isJsonApiError(object)

Will return boolean indicating whether object has all required properties to be a parsed `ApiError`.

```javascript
  // Will return true
  isJsonApiError({ status: 200, code: 'MY_CODE', title: 'MY_ERROR', detail: {} })

  // Will return false
  isJsonApiError({ status: 200, code: 'MY_CODE' })
```

> Will automatically cast to ParsedError if succeeds and using Typescript

### parseErrors(error, i18nOptions (optional))

Parse any data into an error object with all properties needed for jsonade parser. Also parses [`express-validation`](https://github.com/andrewkeig/express-validation) and [`celebrate`](https://github.com/arb/celebrate) errors.

```javascript
const error = new BadRequestError(...);
const parsedError = parseErrors(error);

// jsonade serializer afterwards (optional)
serializer.serialize([parsedError]);
```

With i18n support (optional):

```javascript
const error = new BadRequestError(...);
const parsedError = parseErrors(error, {
  defaultLocale: 'en',          // Optional (defaults to 'en')
  language: 'nl',               // Optional (defaults to 'en')
  path: __dirname = '/locales',
});

// jsonade serializer afterwards (optional)
serializer.serialize([parsedError]);
```

> The `parseErrors` function will load the i18n configuration once, and reuse the same instance afterwards. It is not possible to overwrite the configuration after the first call. This has to do with performance and caching of translations.

### parseJsonErrors(object)

Parse json object containing errors into javascript `ApiError` instances. Will return an array with all non-errors filtered out or default InternalServerError if no errors were found.

```javascript
  try {
    await doApiCall(...);
    // Returns { errors: [{ status: 400, code: 'BAD_REQUEST', ... }] }
  } catch(errorResponse) {
    const errors = parseJsonResponse(errorResponse);
    // Will return array containing `ApiError` objects
  }
```

> Make sure the object contains an `errors` root key: `{ errors: [ ... ] }`

## Tests

- You can run `npm run test` to run all tests
- You can run `npm run test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/tree-house-errors/issues](https://github.com/icapps/tree-house-errors/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/tree-house-errors/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
