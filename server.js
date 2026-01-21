import net from 'node:net';
import fs from 'fs/promises';
import { getStatusMessage } from './statusCodes.js';

const IP = '127.0.0.1';
const PORT = 80;
const DEFAULT_HTTP_VERSION = 'HTTP/1.1';

function parseRequest(data) {
  const lines = data.toString().split("\r\n");
  const requestLine = lines[0];

  if (!requestLine) return null;

  const [method, path, httpVersion] = requestLine.split(' ');
  return {
    method,
    path,
    httpVersion
  }
};

function generateResponse(httpVersion = DEFAULT_HTTP_VERSION, statusCode = 500, body = null) {
  const statusMessage = getStatusMessage(statusCode);
  const bodyContent = body || '';

  return `${httpVersion} ${statusCode}\r\n\r\n${statusMessage}\r\n${bodyContent}\r\n`;
};


const server = net.createServer((c) => {
  console.log('SERVER CONNECTED');

  c.on('data', async (data) => {
    const req = parseRequest(data);
    if (!req) {
      const response = generateResponse(DEFAULT_HTTP_VERSION, 400);
      c.write(response);
      c.end();
      return;
    }

    const { method, path, httpVersion } = req;

    if (method === "GET") {
      if (path === "/" || path === "/index.html") {
        try {
          const fileData = await fs.readFile('index.html', 'utf8');
          const response = generateResponse(httpVersion, 200, fileData);
          c.write(response);
          c.end();
          return;
        } catch (err) {
          console.error(err);
          const response = generateResponse(httpVersion, 404, 'Error fetching resource');
          c.write(response);
          c.end();
          return;
        }
      }

      const response = generateResponse(httpVersion, 200, `Requested path: ${path}`);
      c.write(response);
      c.end();
      return;
    }

    const response = generateResponse(httpVersion, 405, path);
    c.write(response);
    c.end();
  });


  c.on('end', () => {
    console.log('SERVER DISCONNECTED');
  });

  c.on('error', (err) => {
    console.error('Socket error: ', err);
  });
});

server.on('error', (err) => {
  console.error(err);
  throw err;
})

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
