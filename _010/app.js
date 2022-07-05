
const { readFile } = require('fs');

const http = require('http');

const server = http.createServer((request, response) => {
  router(request, response);
});

server.listen(8080);

function router(request, response) {
  
    if (request.method === 'GET' ) {
      onGet(request, response);
    } else {
      response.statusCode = 404;
      response.end();
    }
};

function tryReadFile(path, onDataCallback) {
    readFile(path, (err, data) => {
        if (err) console.log(err);
        onDataCallback(data);
      });
};

function onGet(request, response) {
  if (request.url === '/') {
    tryReadFile('index.html', (data)=> {
      response.statusCode = 200;
      response.end(data);
      });
  }
  if (request.url.includes('lib') || request.url.includes('img')) {
    tryReadFile(__dirname + '/..' + request.url, (data)=> {
      response.statusCode = 200;
      response.end(data);
      });
  }
  else {
    tryReadFile(__dirname + request.url, (data)=> {
      response.statusCode = 200;
      response.end(data);
      });
  }
};