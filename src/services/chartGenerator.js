const ChartjsNode = require('chartjs-node');
var constants = require('./constants');
var plugins = require('./plugins');
var logger = require('./logger');

const chartTypes = new Map([
  ['line', formatLine],
  ['bar', formatBar],
  ['pie', formatDoughnut],
  ['doughnut', formatDoughnut]
]);

function scaffoldConfig(d) {
  let config = {
    size: {
      chartWidth: d.chartWidth || 600,
      chartHeight: d.chartHeight || 600
    },
    chartParams: {
      type: d.type,
      data: d.data,
      options: d.options || {}
    }
  };
  return config;
}

function formatLine(data) {
  logger.debug('formatLine called with data: [%s]', JSON.stringify(data));
  let config = scaffoldConfig(data);
  config.chartParams.data.datasets.forEach(function(item, index) {
    item.fill = false;
    item.backgroundColor = constants.colors[index % constants.colors.length];
    item.borderColor = constants.colors[index % constants.colors.length];
  });
  return scaffoldConfig(data);
}

function formatBar(data) {
  logger.debug('formatBar called with data: [%s]', JSON.stringify(data));
  let config = scaffoldConfig(data);
  config.chartParams.data.datasets.forEach(function(item, index) {
    item.backgroundColor = constants.colors[index % constants.colors.length];
    item.borderColor = constants.colors[index % constants.colors.length];
  });
  return scaffoldConfig(data);
}

function formatDoughnut(data) {
  logger.debug('formatPie called with data: [%s]', JSON.stringify(data));
  let config = scaffoldConfig(data);
  config.chartParams.data.datasets = [config.chartParams.data.datasets[0]];
  config.chartParams.data.datasets[0].backgroundColor = constants.colors;
  config.chartParams.options.scales.xAxes[0].display = false;
  config.chartParams.options.scales.yAxes[0].display = false;
  return config;
}

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
    return new Promise((resolve, reject) => {
      reject('Non valid body.');
    });
  }
  
  let config = chartTypes.get(data.type)(data);
  logger.debug(JSON.stringify(config, null, 2));
  return drawChart(config);
}

exports.newChart = newChart;