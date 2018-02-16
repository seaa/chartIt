var express = require('express');
var http = require('http');
var url = require('url');
var routesHandler = require('./routes/index');
var logger = require('./services/logger');
var constants = require('./services/constants');
var morgan = require('morgan');
var loggerMorgan = morgan(
  '[:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":user-agent" - :response-time ms'
);

const PORT = process.env.PORT ? process.env.PORT : constants.port;

const handlers = {
  '/': routesHandler.chartit,
};

const router = {
  router: (handlers, pathname, response, request, postData) => {
    if (typeof handlers[pathname] === 'function') {
      handlers[pathname](response, request, postData);
    } else {
      logger.error('No request handler found for "%s"', pathname);
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('404 Not found');
      response.end();
    }
  }
}

const start = {
  start: (router, handlers) => {
    function onRequest(request, response) {
      loggerMorgan(request, response, function(err) {
        return err;
      });
      var pathname = url.parse(request.url).pathname;
      var postData = '';
      
      request.addListener('data', postDataChunk => {
        logger.debug(
          'Received POST data chunk (value inside brackets): [%s]',
          postDataChunk
        );
        postData += postDataChunk;
      });
      
      request.addListener('end', () => {
        logger.debug(
          'All POST data received (value inside brackets): [%s]',
          postData
        );
        router(handlers, pathname, response, request, postData);
      });
      
      request.addListener('error', err => {
        logger.error('Error in request: ', err.stack);
      });
    };

    http.createServer(onRequest).listen(PORT);
    logger.info('Server has started on port %s', PORT);
  }
}

const ChartitServer = () => {
  return Object.assign({}, router, start);
};

/// Main process
let server = ChartitServer();
server.start(server.router, handlers);
