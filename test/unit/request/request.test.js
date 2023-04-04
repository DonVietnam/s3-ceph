const { Readable } = require('stream');
const { test, expect, describe, beforeAll, afterAll } = require('@jest/globals');
const { startServer, closeServer, request, getMockUrl, RESULTS } = require('./prepare');

const expectError = (reqexp) => {
  return expect.objectContaining({ data: { message: expect.stringMatching(reqexp) } });
};

describe('Test for request module.', () => {
  beforeAll(startServer);

  test('Request_ReturnParsedContent_SuccessStatusAndSupportedContentType', async () => {
    await expect(request(getMockUrl('test200'), null, { parseResponse: true })).resolves.toEqual(RESULTS[200]);
  });

  test('Request_ThrowError_GetUnsupportedContentType', async () => {
    await expect(request(getMockUrl('unsupported-content-type'), null, { parseResponse: true })).rejects.toThrow(expectError(/unsupported/gi));
  });

  test('Request_ThrowError_GetCorruptedContent', async () => {
    await expect(request(getMockUrl('corrupted-content'), null, { parseResponse: true })).rejects.toThrow(expectError(/parsing/gi));
  });

  test('Request_ReturnReadable_ParseResponseFalse', async () => {
    await expect(request(getMockUrl('test200'), null, { parseResponse: false })).resolves.toBeInstanceOf(Readable);
  });

  test('Request_ReturnHttpErrorWithoutMessage_ServerError', async () => {
    await expect(request(getMockUrl('test500'), null)).rejects.toThrowError(expect.objectContaining({ statusCode: 500, message: 'Internal Server Error' }));
  });

  test('Request_ReturnHttpErrorWithMessage_ClientError', async () => {
    await expect(request(getMockUrl('test400'), null)).rejects.toThrowError(expect.objectContaining({ statusCode: 400, message: expect.stringMatching(/invalid/gi) }));
  });

  test('Request_SendData_ReadableStreamPassed', async () => {
    const stream = Readable.from(JSON.stringify(RESULTS[200]));
    await expect(request(getMockUrl('testdata'), stream, { parseResponse: true, method: 'POST' })).resolves.toEqual(RESULTS[200]);
  });

  test('Request_SendData_StringPassed', async () => {
    const data = JSON.stringify(RESULTS[200]);
    await expect(request(getMockUrl('testdata'), data, { parseResponse: true, method: 'POST' })).resolves.toEqual(RESULTS[200]);
  });

  test('Request_SendData_BufferPassed', async () => {
    const data = Buffer.from(JSON.stringify(RESULTS[200]));
    await expect(request(getMockUrl('testdata'), data, { parseResponse: true, method: 'POST' })).resolves.toEqual(RESULTS[200]);
  });

  afterAll(closeServer);
});
