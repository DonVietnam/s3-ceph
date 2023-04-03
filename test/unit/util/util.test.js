const { test, expect, describe } = require('@jest/globals');
const { TEST_REQEUSTS, TEST_KEY, TEST_SECRET, HEADERS_PREFIX, getCanonicalizedHeaders, getStringToSign, prepareURLForSign, getSignature } = require('./prepare');

describe('Utility function tests.', () => {
  test('GetCanonicalizedHeaders_ReturnLowerCasedHeaders_HerdersPassedInMultiCase', () => {
    const headers = { [`${HEADERS_PREFIX}Test-Header-Name`]: 'test-header-value' };
    expect(getCanonicalizedHeaders(headers)).toEqual([[`${HEADERS_PREFIX}test-header-name`, 'test-header-value']]);
  });

  test('GetCanonicalizedHeaders_FilterHeadersWithoutPrefixOrNotPosition_HeadersStartedWithoutPrefixPassed', () => {
    const headers = { [`Test-Header-Name`]: 'test-header-value' };
    expect(getCanonicalizedHeaders(headers)).toEqual([]);
  });

  test('GetCanonicalizedHeaders_RemoveFoldingSpaces_HeaderWithFoldingSpacesPassed', () => {
    const headers = { [`${HEADERS_PREFIX}Test-Header-Name`]: ' test-header-value\n\t  test-after-space ' };
    expect(getCanonicalizedHeaders(headers)).toEqual([[`${HEADERS_PREFIX}test-header-name`, 'test-header-value test-after-space']]);
  });

  test('GetCanonicalizedHeaders_CombineMultipleValueInOneString_MultipleValuePassed', () => {
    const headers = { [`${HEADERS_PREFIX}Test-Header-Name`]: [' first-value ', ' second-value '] };
    expect(getCanonicalizedHeaders(headers)).toEqual([[`${HEADERS_PREFIX}test-header-name`, 'first-value,second-value']]);
  });

  test('GetCanonicalizedHeaders_SortHeadersLexicographically_MultipleHeadersPassed', () => {
    const headers = {
      [`${HEADERS_PREFIX}Test-Header-Name-B`]: 'test-value',
      [`${HEADERS_PREFIX}Test-Header-Name-C`]: 'test-value',
      [`${HEADERS_PREFIX}Test-Header-Name-A`]: 'test-value'
    };
    expect(getCanonicalizedHeaders(headers)).toEqual([
      [`${HEADERS_PREFIX}test-header-name-a`, 'test-value'],
      [`${HEADERS_PREFIX}test-header-name-b`, 'test-value'],
      [`${HEADERS_PREFIX}test-header-name-c`, 'test-value']
    ]);
  });

  test('GetStringToSign_LeftBlankLine_PositionHeadersMissed', () => {
    const headers = { [`${HEADERS_PREFIX}Test-Header-Name`]: 'test-value', 'Content-Type': 'image/jpeg' };
    expect(getStringToSign('GET', '/path', headers)).toEqual(`GET\n\nimage/jpeg\n\n${HEADERS_PREFIX}test-header-name:test-value\n/path`);
  });

  test('GetStringToSign_LeftBlankLine_PositionHeadersMissed', () => {
    const headers = { [`${HEADERS_PREFIX}Test-Header-Name`]: 'test-value', 'Content-Type': 'image/jpeg' };
    expect(getStringToSign('GET', '/path', headers)).toEqual(`GET\n\nimage/jpeg\n\n${HEADERS_PREFIX}test-header-name:test-value\n/path`);
  });

  test('PrepareURLForSign_AddSlash_EmptyPathPassed', () => {
    expect(prepareURLForSign(new URL('http://example.ru'))).toEqual(`/`);
  });

  test('PrepareURLForSign_AddSortedQueryParams_AllowedQueryParamsPassed', () => {
    expect(prepareURLForSign(new URL('http://example.ru/?test=1&uploadId=2&acl=3'))).toEqual(`/?acl=3&uploadId=2`);
  });

  test('GetSignature_GenerateProperSignature_DifferentExamplesPassed', () => {
    for (const request of TEST_REQEUSTS) {
      expect(getSignature(new URL(request.url), request.method, request.headers, TEST_KEY, TEST_SECRET)).toEqual(request.signature);
    }
  });
});
