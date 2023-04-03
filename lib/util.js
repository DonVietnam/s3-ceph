const { createHmac } = require('node:crypto');

const SIGNATURE_TYPE = 'AWS';
const ALGORITHM = 'sha1';
const HEADERS_PREFIX = 'x-amz-';
const POSITION_HEADER_NAMES = ['content-md5', 'content-type', 'date'];
const ALLOWED_QUERY_FIELDS = [
  'acl',
  'lifecycle',
  'location',
  'logging',
  'notification',
  'partNumber',
  'policy',
  'requestPayment',
  'uploadId',
  'uploads',
  'versionId',
  'versioning',
  'versions',
  'website'
];

const isPositionHeader = (name = '') => POSITION_HEADER_NAMES.includes(name);

const getCanonicalizedValue = (value = '') => {
  const trimmedValue = Array.isArray(value) ? value.map((element) => element.trim()).join(',') : value.trim();
  return `${trimmedValue.replace(/\s\s+/g, ' ')}`;
};

const getCanonicalizedHeaders = (headersMap = {}) => {
  const result = [];
  for (const [key, value] of Object.entries(headersMap)) {
    const lowercasedKey = key.toLocaleLowerCase();
    if (lowercasedKey.startsWith(HEADERS_PREFIX) || isPositionHeader(lowercasedKey)) {
      result.push([lowercasedKey, getCanonicalizedValue(value)]);
    }
  }
  return result.sort((first, second) => (first > second ? 1 : -1));
};

const getPositionHeaderValues = (headers = []) => {
  const result = new Array(POSITION_HEADER_NAMES.length).fill('');
  for (const [key, value] of headers) {
    if (isPositionHeader(key)) result[POSITION_HEADER_NAMES.indexOf(key)] = value;
  }
  return result;
};

const getStringToSign = (method = '', url = '', headersMap = {}) => {
  const rows = [`${method.toUpperCase()}`];
  const canonicalHeaders = getCanonicalizedHeaders(headersMap);
  rows.push(...getPositionHeaderValues(canonicalHeaders));
  for (const [key, value] of canonicalHeaders) {
    if (!isPositionHeader(key)) rows.push(`${isPositionHeader(key) ? '' : key}:${value}`);
  }
  rows.push(url);
  return rows.join('\n');
};

const prepareURLForSign = (url = {}) => {
  const { pathname, searchParams } = url;
  const allowed = [];
  for (const [key, value] of searchParams) {
    if (ALLOWED_QUERY_FIELDS.includes(key)) allowed.push(`${key}${value ? `=${value}` : ''}`);
  }
  const search = allowed.length ? `?${allowed.sort().join('&')}` : '';
  return `${pathname || '/'}${search}`;
};

const getSignature = (url = {}, method = '', headersMap = {}, key = '', secret = '') => {
  const stringToSign = getStringToSign(method, prepareURLForSign(url), headersMap);
  const hmac = createHmac(ALGORITHM, secret);
  const digest = hmac.update(stringToSign).digest();
  return `${SIGNATURE_TYPE} ${key}:${digest.toString('base64')}`;
};

module.exports = {
  getCanonicalizedHeaders,
  getCanonicalizedValue,
  getStringToSign,
  prepareURLForSign,
  getSignature,
  SIGNATURE_TYPE,
  HEADERS_PREFIX,
  ALGORITHM,
  POSITION_HEADER_NAMES,
  ALLOWED_QUERY_FIELDS
};
