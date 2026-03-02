import * as net from "node:net";
import { getStatusMessage } from "./statusCodes";

const IP = "127.0.0.1";
const PORT = 80;
const DEFAULT_HTTP_VERSION = "HTTP/1.1";

function parseRequest(data) {
  const lines = data.toString().split("\r\n");
  const requestLine = lines[0];

  if (!requestLine) return null;

  const [method, path, httpVersion] = requestLine.split(" ");
  return {
    method,
    path,
    httpVersion,
  };
}

function generateResponse(
  httpVersion = DEFAULT_HTTP_VERSION,
  statusCode = 500,
  path = null,
) {
  const statusMessage = getStatusMessage(statusCode);
  const pathInfo = path ? `\r\nRequested path: ${path}` : "";
  return `${httpVersion} ${statusCode} ${statusMessage}\r\n${pathInfo}\r\n`;
}

const server = net.createServer((c) => {
  console.log("SERVER CONNECTED");

  c.on("data", (data) => {
    const req = parseRequest(data);
    if (!req) {
      const response = generateResponse(DEFAULT_HTTP_VERSION, 400);
      c.write(response);
      c.end();
      return;
    }

    const { method, path, httpVersion } = req;

    if (method === "GET") {
      const response = generateResponse(httpVersion, 200, path);
      c.write(response);
      c.end();
      return;
    }

    const response = generateResponse(httpVersion, 405, path);
    c.write(response);
    c.end();
  });

  c.on("end", () => {
    console.log("SERVER DISCONNECTED");
  });

  c.on("error", (err) => {
    console.error("Socket error: ", err);
  });
});

server.on("error", (err) => {
  console.error(err);
  throw err;
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
