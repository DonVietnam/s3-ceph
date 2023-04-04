import { Readable } from 'stream';
import { RequestOptions } from 'http';

/**
 * @description Options for package's request function.
 */
declare interface Options {
  /**
   * @description Do we need to parse server's response or return Readable stream instead.
   */
  parseResponse?: boolean;
}

/**
 * @description Supported Mime Type parsers. Extend if need.
 */
export const TYPE_PARSERS: { [mimeType: string]: () => {} };

/**
 * @description This function determinds if response status is success or not.
 */
export declare function isSuccess(statusCode: number): boolean;

/**
 * @description This function return proper transport for passed URL, http or https.
 */
export declare function getTransport(protocol: string): () => {};

/**
 * @description This function get response body from Readable stream.
 */
export declare function getBody(response: Readable): Promise<Buffer>;

/**
 * @description This function choose and call parser for response body.
 */
export declare function parse(response: Readable): Promise<String | Object>;

/**
 * @description This function make request to remote server based on provided URL, data and options. Set data to null if need to pass options with no data.
 */
export declare function request(url: string | URL, data?: string | Buffer | Readable, options?: Options & RequestOptions): Promise<Readable | String | Object>;
