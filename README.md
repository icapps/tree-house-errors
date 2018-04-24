# Treehouse Errors

Custom NodeJS error classes and definitions with an error parser utility function

[![npm version](https://badge.fury.io/js/tree-house-errors.svg)](https://badge.fury.io/js/tree-house-errors)
[![Dependencies](https://david-dm.org/icapps/tree-house-errors.svg)](https://david-dm.org/icapps/tree-house-errors.svg)
[![Build Status](https://travis-ci.org/icapps/tree-house-errors.svg?branch=master)](https://travis-ci.org/icapps/tree-house-errors)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house-errors/badge.svg)](https://coveralls.io/github/icapps/tree-house-errors)

## Installation

Install via npm

```shell
npm install tree-house-errors
```

or via yarn

```shell
yarn add tree-house-errors
```

## Error types

### ApiError

Base error class which extends from the `Error` class.

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

### BadRequestError

extends from ApiError with a preset of status code 400 and BAD_REQUEST as error.

```javascript
throw new BadRequestError(); // or
throw new BadRequestError(error, optionalArgs);
```

### NotFoundError

extends from ApiError with a preset of status code 404 and RESOURCE_NOT_FOUND as error.

```javascript
throw new NotFoundError(); // or
throw new NotFoundError(error, optionalArgs);
```

### ForbiddenError

extends from ApiError with a preset of status code 403 and FORBIDDEN as error.

```javascript
throw new ForbiddenError(); // or
throw new ForbiddenError(error, optionalArgs);
```

### InternalServerError

extends from ApiError with a preset of status code 500 and INTERNAL_ERROR as error.

```javascript
throw new InternalServerError(); // or
throw new InternalServerError(error, optionalArgs);
```

### UnauthorizedError

extends from ApiError with a preset of status code 401 and UNAUTHORIZED as error.

```javascript
throw new UnauthorizedError(); // or
throw new UnauthorizedError(error, optionalArgs);
```

### ValidationError

extends from ApiError with a preset of status code 400 and INVALID_INPUT as error.

```javascript
throw new ValidationError(); // or
throw new ValidationError(error, optionalArgs);
```

### AuthenticationError

extends from ApiError with a preset of status code 400 and AUTHENTICATION_FAILED as error.

```javascript
throw new AuthenticationError(); // or
throw new AuthenticationError(error, optionalArgs);
```

## Error definitions

Predefined error types that can be used over multiple projects with a message and code per type. The current list provides following errors:

```javascript
INTERNAL_ERROR:           { code: 'INTERNAL_ERROR', message: 'An unkown error occurred' },
INVALID_INPUT:            { code: 'INVALID_INPUT', message: 'Invalid input provided' },
AUTHENTICATION_FAILED:    { code: 'AUTHENTICATION_FAILED', message: 'Authentication failed' },
BAD_REQUEST:              { code: 'BAD_REQUEST', message: 'Bad request' },
MISSING_HEADERS:          { code: 'MISSING_HEADERS', message: 'Missing headers' },
UNAUTHORIZED:             { code: 'UNAUTHORIZED', message: 'Unauthorized' },
FORBIDDEN:                { code: 'FORBIDDEN', message: 'No access' },
RESOURCE_NOT_FOUND:       { code: 'RESOURCE_NOT_FOUND', message: 'Resource not found' },
```

Example

```javascript
import { errorConfig as errors } from 'tree-house-errors'
throw new ApiError(400, errors.BAD_REQUEST);
```

## Error parsing

### parseErrors(error)

Parse any data into an error object with all properties needed for jsonade parser. Also parses `express-validation` errors.

```javascript
const error = new BadRequestError(...);
const parsedError = parseErrors(error);

// jsonade serializer afterwards (optional)
serializer.serialize([parsedError]);
```

## Import translations

Import new or updated translations from the iCapps translation portal

```javascript
  import { importTranslations } from 'tree-house-errors';

  await importTranslations('applicationToken');
```

## Tests

- You can run `yarn test` to run all tests
- You can run `yarn test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/tree-house-errors/issues](https://github.com/icapps/tree-house-errors/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/tree-house-errors/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
