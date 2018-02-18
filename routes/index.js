var generator = require('../services/chartGenerator');
var logger = require('../services/logger');
var constants = require('../services/constants');
var validate = require('../services/validators');

function _fillResponse(status, responseBody, response) {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseBody.toString(), 'utf8')
  });
  response.end(responseBody);
}

function _validatePayload(postData, response) {
  let data = null;
  try {
    data = validate.payloadAsJSON(postData);
  } catch (e) {
    logger.error(e.message);
    _fillResponse(400, '{ "status": "Bad Request", "error": "Json body malformed" }', response);
  }
  return data;
}

function _validateMethod(method, handler, response) {
  let allowedMethods = constants.methodsMap.get(handler);
  if (!allowedMethods.includes(method)) {
    logger.error('Received non valid method.');
    _fillResponse(200, '{ "message": "Allowed method is POST" }', response);
    return false;
  }
  return true;
}

var handlers = {
  chartit: function (response, request, postData) {
    logger.debug(
      "Request handler 'chartit' was called with postData: %s",
      JSON.stringify(postData)
    );

    if (_validateMethod(request.method, 'chartit', response)) {
      let data = _validatePayload(postData, response);
      if (data) {
        generator.newChart(data)
        .then(streamResult => {
          var src = `data:image/png;base64,${streamResult.toString('base64')}`;
          //_fillResponse(200, '{ "chart": "' + src + '" }', response);
          _fillResponse(200, '<html><div> <img src="' + src + '" > </div><html>', response);
        })
        .catch(err => {
          logger.error('status: %s, on charter.newChart, details: ' + err, 500);
          _fillResponse(500, '{ "error": "ERROR while trying to generate chart" }', response);
        });
      }
    }
  }
};

module.exports = {
  chartit: handlers.chartit
};
