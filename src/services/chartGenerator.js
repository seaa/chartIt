const ChartjsNode = require('chartjs-node');
var logger = require('./logger');

const plugin_whiteBackground = {
  beforeDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
};

const plugin_piePercentages = {
  beforeInit: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    var totalPercentage = 0;
    chartInstance.chart.config.data.labels.forEach(function(label, index) {
      totalPercentage += chartInstance.chart.config.data.datasets[0].data[index];
    });
    chartInstance.chart.config.data.labels.forEach(function(label, index) {
      var percentage = chartInstance.chart.config.data.datasets[0].data[index] * 100 / totalPercentage;
      percentage = parseFloat(percentage.toFixed(2));
      chartInstance.chart.config.data.labels[index] = label + ' (' + percentage + '%)';
    });
  }
};

const chartTypes = new Map([
  ['line', formatLine],
  ['bar', formatBar],
  ['pie', formatDoughnut],
  ['doughnut', formatDoughnut]
]);

const chartColors = [
  'rgb(255, 159, 64)', // orange
  'rgb(54, 162, 235)', // blue
  'rgb(75, 192, 192)', // green
  'rgb(255, 99, 132)', // red
  'rgb(255, 205, 86)', // yellow
  'rgb(153, 102, 255)', // purple
  'rgb(201, 203, 207)' // grey
];

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
    item.backgroundColor = chartColors[index % chartColors.length];
    item.borderColor = chartColors[index % chartColors.length];
  });
  return scaffoldConfig(data);
}

function formatBar(data) {
  logger.debug('formatBar called with data: [%s]', JSON.stringify(data));
  let config = scaffoldConfig(data);
  config.chartParams.data.datasets.forEach(function(item, index) {
    item.backgroundColor = chartColors[index % chartColors.length];
    item.borderColor = chartColors[index % chartColors.length];
  });
  return scaffoldConfig(data);
}

function formatDoughnut(data) {
  logger.debug('formatPie called with data: [%s]', JSON.stringify(data));
  let config = scaffoldConfig(data);
  config.chartParams.data.datasets = [config.chartParams.data.datasets[0]];
  config.chartParams.data.datasets[0].backgroundColor = chartColors;
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
      Chartjs.pluginService.register(plugin_whiteBackground);
      if (config.chartParams.type === 'pie') {
        Chartjs.pluginService.register(plugin_piePercentages);
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