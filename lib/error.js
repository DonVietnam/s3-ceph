const { STATUS_CODES } = require('http');

const BAD_GATEWAY_STATUS_CODE = 502;

const isClientError = (statusCode) => statusCode.toString()[0] === '4';
const isErrorObject = (data) => typeof data === 'object' && data.message;

class HttpError extends Error {
  constructor(statusCode, data, cause) {
    super(STATUS_CODES[statusCode]);
    if (isClientError(statusCode) && isErrorObject(data)) this.message = `${this.message}. ${data.message}`;
    this.cause = cause;
    this.data = data;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResponseParseError extends HttpError {
  constructor(message, cause) {
    super(BAD_GATEWAY_STATUS_CODE, { message }, cause);
  }
}

module.exports = {
  HttpError,
  ResponseParseError,
  BAD_GATEWAY_STATUS_CODE
};
