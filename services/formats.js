var constants = require('./constants');
var logger = require('./logger');

var _baseConfig = (data) => {
  let config = {
    size: {
      chartWidth: data.chartWidth || constants.width,
      chartHeight: data.chartHeight || constants.height
    },
    chartParams: {
      type: data.type,
      data: data.data,
      options: data.options || {}
    }
  };
  return config;
};

// Line and Bar charts
function basic(data) {
  logger.debug('basic format called with data: [%s]', JSON.stringify(data));
  return _baseConfig(data);
}

// Pie and Doughnut charts
function pie(data) {
  logger.debug('pie format called with data: [%s]', JSON.stringify(data));
  let config = _baseConfig(data);
  config.chartParams.data.datasets = [config.chartParams.data.datasets[0]];
  config.chartParams.data.datasets[0].backgroundColor = config.chartParams.data.datasets[0].backgroundColor || constants.colors;
  config.chartParams.options.scales.xAxes[0].display = false;
  config.chartParams.options.scales.yAxes[0].display = false;
  return config;
}

module.exports = {
  basic: basic,
  pie: pie
}

