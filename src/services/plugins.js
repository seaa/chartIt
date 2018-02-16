const whiteBackground = {
  beforeDraw: (chartInstance) => {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
};

const piePercentages = {
  beforeInit: (chartInstance) => {
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

module.exports = {
  whiteBackground: whiteBackground,
  piePercentages: piePercentages
}