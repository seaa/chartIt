var generator = require('../services/chartGenerator');
var logger = require('../services/logger');

function _fillResponse(status, responseBody, response) {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseBody.toString(), 'utf8')
  });
  response.end(responseBody);
}

var handlers = {
  chartit: function (response, request, postData) {
    logger.debug(
      "Request handler 'chartit' was called with postData: %s",
      JSON.stringify(postData)
    );

    if (request.method !== 'POST') {
      logger.error('Received non valid method.');
      _fillResponse(200, '{ "message": "Allowed method is POST" }', response);
      return null;
    }

    let data;
    try {
      data = JSON.parse(postData);
    } catch (e) {
      logger.error('Received non valid JSON.');
      _fillResponse(400, '{ "status": "Bad Request", "error": "Json body malformed" }', response);
      return null;
    }

    generator.newChart(data)
    .then(streamResult => {
      var src = `data:image/png;base64,${streamResult.toString('base64')}`;
      _fillResponse(200, '{ "chart": "' + src + '" }', response);
    })
    .catch(err => {
      logger.error('status: %s, on charter.newChart, details: ' + err, 500);
      _fillResponse(500, '{ "error": "ERROR while trying to generate chart" }', response);
    });
  }
};

module.exports = {
  chartit: handlers.chartit
};
