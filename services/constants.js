const PORT = 8888;
const HEIGHT = 600;
const WIDTH = 600;

const COLORS = [
  'rgb(255, 159, 64)', // orange
  'rgb(54, 162, 235)', // blue
  'rgb(75, 192, 192)', // green
  'rgb(255, 99, 132)', // red
  'rgb(255, 205, 86)', // yellow
  'rgb(153, 102, 255)', // purple
  'rgb(201, 203, 207)' // grey
];

const METHODS = new Map([
  ['chartit', ['POST']],
]);

module.exports = {
  port: PORT,
  colors: COLORS,
  height: HEIGHT,
  width: WIDTH,
  methodsMap: METHODS
};