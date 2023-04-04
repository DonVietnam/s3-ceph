const { createServer } = require('http');
const { request } = require('../../../lib/request');

const address = { host: '127.0.0.1', port: null };

const RESULTS = {
  200: { result: 'ok' },
  400: { message: 'invalid' },
  500: { error: 'internal' }
};

const mockRoutes = {
  '/test200': (response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(RESULTS[200]));
  },

  '/unsupported-content-type': (response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'unsupported/json');
    response.end(JSON.stringify(RESULTS[200]));
  },

  '/corrupted-content': (response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(RESULTS[200]).slice(0, 3));
  },

  '/test500': (response) => {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(RESULTS[500]));
  },

  '/test400': (response) => {
    response.statusCode = 400;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(RESULTS[400]));
  },

  '/testdata': (response, request) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    request.pipe(response);
  }
};

const router = (request, response) => {
  const { url } = request;
  const executor = mockRoutes[url];
  executor(response, request);
};

const server = createServer(router);

const closeServer = async () => {
  server.close();
};

const startServer = async () => {
  server.listen(null, '127.0.0.1');
  return new Promise((resolve, reject) => {
    const handleListening = () => {
      address.port = server.address().port;
      resolve();
    };
    const handleClose = () => {
      server.removeListener('listening', handleListening);
      server.removeListener('error', reject);
      server.removeListener('close', handleClose);
    };
    server.on('listening', handleListening);
    server.on('error', reject);
    server.on('close', handleClose);
  });
};

const getMockUrl = (path) => {
  return `http://${address.host}:${address.port}/${path}`;
};

module.exports = {
  startServer,
  closeServer,
  address,
  request,
  getMockUrl,
  RESULTS
};
