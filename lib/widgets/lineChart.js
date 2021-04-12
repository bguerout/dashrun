const contrib = require("blessed-contrib");

function lineChart(types, options = {}) {
  let nbPoints = options.nbPoints || 80;

  let component = contrib.line({
    label: "Line Chart",
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    legend: { width: 12 },
    ...options,
  });

  let lines = types.reduce((acc, { name, color }) => {
    return {
      ...acc,
      [name]: {
        title: name,
        x: [...Array(nbPoints).keys()].map(() => " "),
        y: [...Array(nbPoints).keys()].map(() => " "),
        style: {
          line: color,
        },
      },
    };
  }, {});

  component.update = function (name, data) {
    lines[name].y.shift();
    lines[name].y.push(data);
    component.setData(Object.keys(lines).map((key) => lines[key]));
    this.emit("updated");
  };

  return component;
}

module.exports = lineChart;
