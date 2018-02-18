const ChartjsNode = require('chartjs-node');
var constants = require('./constants');
var plugins = require('./plugins');
var formats = require('./formats');
var logger = require('./logger');

const chartTypes = new Map([
  ['line', formats.basic],
  ['bar', formats.basic],
  ['pie', formats.pie],
  ['doughnut', formats.pie]
]);

function drawChart(config) {
  logger.debug('drawChart called with config: [%s]', JSON.stringify(config));
  var generation = new Promise(function(resolve, reject) {
    var chartNode = new ChartjsNode(
      config.size.chartWidth,
      config.size.chartHeight
    );

    chartNode.on('beforeDraw', function(Chartjs) {
      Chartjs.pluginService.register(plugins.whiteBackground);
      if (config.chartParams.type === 'pie') {
        Chartjs.pluginService.register(plugins.piePercentages);
      }
    });

    chartNode.drawChart(config.chartParams).then(() => {
      // get image as png buffer
      chartNode.getImageBuffer('image/png').then(buffer => {
        Array.isArray(buffer);
        // cast as a stream
        resolve(buffer);
        chartNode.getImageStream('image/png').then(streamResult => {
          chartNode.destroy();
          streamResult.filename = config.filename;
          resolve(streamResult);
        });
      });
    });
  });
  return generation;
}

function newChart(data) {
  logger.debug('newChart called with data: [%s]', JSON.stringify(data));
  logger.info('rendering chart');
  
  if (!data || !data.type) {
    return new Promise((resolve, reject) => {reject('Non valid body.');});
  }
  
  if (!chartTypes.get(data.type)) {
    return new Promise((resolve, reject) => {reject('Invalid chart type.');});
  }
  
  return drawChart(chartTypes.get(data.type)(data));
}

exports.newChart = newChart;