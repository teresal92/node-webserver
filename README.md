JavaScript / Node solution to [John Crickett's Build Your Own Web Server Coding Challenge](https://codingchallenges.fyi/challenges/challenge-webserver)

basic HTTP server that listens on port 80 and can handle a single TCP connection at a time

## Requirements
### Step 1:
- For all requests, should return a text response describing the requested path
- server needs to create a socket and bind it to address of the local server (IP: 127.0.0.1 and port: 80 - default HTTP port)
- server needs to listen for requests, accept the request and incoming data
- parses request data to extract key elements (request method (GET, etc.), value, resource, and HTTP version)
- return bare mininimum HTTP response (status code, `Requested path: <the  path>`)
- server should close the socket when done sending data


### Step 2:
- serve a HTML document


## Tests


Request

```bash
curl http://localhost/
```

Response

```bash
Requested path: /
```