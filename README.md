#  ChartIt!

> Generates custom charts on request

## What is this?

A server that provides an API to generate charts from custom data, and returns the image base64 representation to be used on web apps.

ChartIt uses [chartjs-node](https://github.com/vmpowerio/chartjs-node) to render [chartjs](https://github.com/chartjs/Chart.js) charts server-side.

## Building

Install dependencies via npm

```bash
> npm install
```

Start the server

```bash
> cd ./src
> npm start
```

## Generate Chart

Server runs on port 8888 as default. POSTing to '/' will generate a chart using data on the request body.

This body must follow the next format:

```javascript
{
  type: String,
  data: Object,
  options: Object
}
```
 
Where the supported types are line, bar, pie, and doughnut. Documentation for data and options formats is available in Chart.js official [doc](http://www.chartjs.org/docs/latest/)

This request will return the following obhect:

```javascript
{
  chart: String,
}
```

Where 'chart' will be the base64 string representation of the chart image, ready to be rendered as a png.

Use example:
```javascript
{
  "type": "bar",
  "data": {
    "labels": [
      "one",
      "two",
      "three",
      "four"
    ],
    "datasets": [
      {
        "label": "DataSetTitle 1",
        "data": [ 2, 5, 4, 9 ]
      },
      {
        "label": "DataSetTitle 2",
        "data": [ 1, 2, 5, 10 ]
      }
    ]
  },
  "options": {
    "title": {
      "display": true,
      "text": "Test Chart Title",
      "fontSize": 25
    },
    "legend": {
      "labels": {
        "fontSize": 25
      }
    },
    "scales": {
      "xAxes": [
        {
          "ticks": {
            "fontSize": 20
          },
          "display": true,
          "scaleLabel": {
            "display": false,
            "labelString": "xAxes"
          }
        }
      ],
      "yAxes": [
        {
          "ticks": {
            "beginAtZero": true
          },
          "display": true,
          "scaleLabel": {
            "display": true,
            "labelString": "yAxes"
          }
        }
      ]
    }
  }
}
```
