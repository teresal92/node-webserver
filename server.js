import net from 'node:net';

const IP = '127.0.0.1';
const PORT = 80;

function parseRequest(data) {
  const lines = data.toString().split("\r\n");
  const requestLine = lines[0];
  const [method, path, httpVersion] = requestLine.split(' ');

  return {
    method,
    path,
    httpVersion
  }
}

const server = net.createServer((c) => {
  console.log('SERVER CONNECTED');

  c.on('data', (data) => {
    const { method, path, httpVersion} = parseRequest(data);

    if (method === "GET") {
      c.write(`${httpVersion} 200 OK\r\n\r\nRequested path: ${path}\r\n`);
      c.end();
    }

    c.end();
  })


  c.on('end', () => {
    console.log('SERVER DISCONNECTED');
  });

  c.on('error', (err) => {
    console.error('Socket error: ', err);
  })
});

server.on('error', (err) => {
  console.error(err)
  throw err;
});

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
