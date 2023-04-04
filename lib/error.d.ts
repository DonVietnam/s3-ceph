/**
 * @description Base class for all HTTP errors.
 */

export declare class HttpError extends Error {
  constructor(statusCode: number, message: string, meta: any, cause: Error);
}

/**
 * @description Http error when our server cannot or unsupport external server response encoding.
 */

export declare class ResponseParseError extends HttpError {
  constructor(message: string, cause: Error);
}

export const BAD_GATEWAY_STATUS_CODE: number;
