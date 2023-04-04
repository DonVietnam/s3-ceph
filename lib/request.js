const http = require('http');
const https = require('https');
const { Readable } = require('stream');

const { HttpError, ResponseParseError, BAD_GATEWAY_STATUS_CODE } = require('./error');

const TYPE_PARSERS = {
  'application/json; charset=utf-8': JSON.parse,
  'application/json': JSON.parse,
  'text/plain': (string) => string,
  'text/plain; charset=utf-8': (string) => string
};

const isSuccess = (statusCode) => statusCode.toString().startsWith('2') || statusCode.toString().startsWith('3');

const getTransport = (protocol) => (protocol === 'https:' ? https.request : http.request);

const getBody = (response) =>
  new Promise((resolve, reject) => {
    const buffers = [];
    const handleData = (chunk) => {
      buffers.push(chunk);
    };
    const handleError = (error) => {
      reject(error);
    };
    const handleEnd = () => {
      response.removeListener('data', handleData);
      response.removeListener('error', handleError);
      response.removeListener('end', handleEnd);
      resolve(Buffer.concat(buffers));
    };

    response.on('data', handleData);
    response.on('error', handleError);
    response.on('end', handleEnd);
  });

const parse = (response) =>
  new Promise((resolve, reject) => {
    const type = response.headers['content-type'];
    if (!TYPE_PARSERS[type]) {
      response.destroy();
      reject(new ResponseParseError(`Unsupported content-type: ${type}`));
    } else {
      const parser = TYPE_PARSERS[type];
      getBody(response)
        .then((body) => resolve(parser(body)))
        .catch((error) => reject(new ResponseParseError('Error parsing an external service response.', error)));
    }
  });

const request = (url, data, { parseResponse, ...options } = {}) =>
  new Promise((resolve, reject) => {
    const { hostname, port, protocol, pathname, search } = new URL(url);
    const transport = getTransport(protocol);
    const path = `${pathname}${search}`;
    const output = transport({ hostname, port, path, ...options }, (response) => {
      const code = response.statusCode;
      if (isSuccess(code)) {
        if (!parseResponse) {
          resolve(response);
        } else {
          parse(response).then(resolve).catch(reject);
        }
      } else {
        parse(response)
          .then((responseData) => {
            reject(new HttpError(code, responseData));
          })
          .catch(reject);
      }
    });

    const handleError = (error) => reject(new HttpError(BAD_GATEWAY_STATUS_CODE, '', '', error));
    const handleClose = () => {
      output.removeListener('error', handleError);
      output.removeListener('close', handleClose);
    };
    output.on('error', handleError);
    output.on('close', handleClose);

    if (data instanceof Readable) data.pipe(output);
    else output.end(data);
  });

module.exports = { request, TYPE_PARSERS, isSuccess, getTransport, getBody, parse };
