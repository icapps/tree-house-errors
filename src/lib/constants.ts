import * as httpStatus from 'http-status';
import { errorConfig as errors } from './errorConfig';

export const errorDefaults = {
  DEFAULT_HTTP_CODE: httpStatus.INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR: errors.INTERNAL_ERROR,
};
