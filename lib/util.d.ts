/**
 * @description This function transform headersMap to Array of tuples, where first entry of tuple is cannonicalized header name and second is value without extra spaces and devided by commas if value was an array.
 */
export declare function getCanonicalizedHeaders(headersMap: { [name: string]: string | Array<string> }): Array<[string, string]>;

/**
 * @description This function transform string value or array of string values, remove extra spaces, concant multiple values into on devided by comma.
 */
export declare function getCanonicalizedValue(value: string | Array<string>): string;

/**
 * @description This function form string to sign with algorithm.
 */
export declare function getStringToSign(method: string, url: URL, headersMap: { [name: string]: string | Array<string> }): string;

/**
 * @description This function prepare URL for signing, remove all disallowed query params.
 */
export declare function prepareURLForSign(url: URL): string;

/**
 * @description This function create signature for placing it in Authorisation header.
 */
export declare function getSignature(url: URL, method: string, headersMap: { [name: string]: string | Array<string> }, key: string, secret: string): string;

export const HEADERS_PREFIX: string;
export const SIGNATURE_TYPE: string;
export const ALGORITHM: string;
export const POSITION_HEADER_NAMES: string;
export const ALLOWED_QUERY_FIELDS: string;
