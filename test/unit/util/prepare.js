const { getCanonicalizedHeaders, HEADERS_PREFIX, getStringToSign, prepareURLForSign, getSignature } = require('../../../lib/util');

const TEST_KEY = 'AKIAIOSFODNN7EXAMPLE';
const TEST_SECRET = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

const TEST_REQEUSTS = [
  {
    method: 'GET',
    url: 'http://example.com/awsexamplebucket1/photos/puppy.jpg',
    headers: {
      Host: 'example.com',
      Date: 'Tue, 27 Mar 2007 19:36:42 +0000'
    },
    signature: 'AWS AKIAIOSFODNN7EXAMPLE:qgk2+6Sv9/oM7G3qLEjTH1a1l1g='
  },
  {
    method: 'PUT',
    url: 'http://example.com/awsexamplebucket1/photos/puppy.jpg',
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': '94328',
      Host: 'example.com',
      Date: 'Tue, 27 Mar 2007 21:15:45 +0000'
    },
    signature: 'AWS AKIAIOSFODNN7EXAMPLE:iqRzw+ileNPu1fhspnRs8nOjjIA='
  },
  {
    method: 'GET',
    url: 'http://example.com/awsexamplebucket1/?prefix=photos&max-keys=50&marker=puppy',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Host: 'example.com',
      Date: 'Tue, 27 Mar 2007 19:42:41 +0000'
    },
    signature: 'AWS AKIAIOSFODNN7EXAMPLE:m0WP8eCtspQl5Ahe6L1SozdX9YA='
  },
  {
    method: 'GET',
    url: 'http://example.com/awsexamplebucket1/?acl',
    headers: {
      Host: 'example.com',
      Date: 'Tue, 27 Mar 2007 19:44:46 +0000'
    },
    signature: 'AWS AKIAIOSFODNN7EXAMPLE:82ZHiFIjc+WbcwFKGUVEQspPn+0='
  },
  {
    method: 'PUT',
    url: 'http://example.com/static.example.com/db-backup.dat.gz',
    headers: {
      'User-Agent': 'curl/7.15.5',
      Host: 'example.com',
      Date: 'Tue, 27 Mar 2007 21:06:08 +0000',
      'x-amz-acl': 'public-read',
      'content-type': 'application/x-download',
      'Content-MD5': '4gJE4saaMU4BqNR0kLY+lw==',
      'X-Amz-Meta-ReviewedBy': ['joe@example.com', 'jane@example.com'],
      'X-Amz-Meta-FileChecksum': '0x02661779',
      'X-Amz-Meta-ChecksumAlgorithm': 'crc32',
      'Content-Disposition': 'attachment; filename=database.dat',
      'Content-Encoding': 'gzip',
      'Content-Length': '5913339'
    },
    signature: 'AWS AKIAIOSFODNN7EXAMPLE:jtBQa0Aq+DkULFI8qrpwIjGEx0E='
  },
  {
    method: 'GET',
    url: 'http://example.com/',
    headers: {
      Host: 'example.com',
      Date: 'Wed, 28 Mar 2007 01:29:59 +0000'
    },
    signature: 'AWS AKIAIOSFODNN7EXAMPLE:qGdzdERIC03wnaRNKh6OqZehG9s='
  },
  {
    method: 'GET',
    url: 'http://example.com/dictionary/français/préfère',
    headers: {
      Host: 'example.com',
      Date: 'Wed, 28 Mar 2007 01:49:49 +0000'
    },
    signature: 'AWS AKIAIOSFODNN7EXAMPLE:81VEw/Bc3GDt/k65Xrrk3AdfI4c='
  }
];

module.exports = {
  TEST_REQEUSTS,
  TEST_KEY,
  TEST_SECRET,
  HEADERS_PREFIX,
  getCanonicalizedHeaders,
  getStringToSign,
  prepareURLForSign,
  getSignature
};
