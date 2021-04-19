const contrib = require("blessed-contrib");

function timeline(lines, options = {}) {
  let nbElements = options.nbElements || 80;

  let component = contrib.line({
    label: "Line Chart",
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    legend: { width: 12 },
    ...options,
  });

  let data = lines.reduce((acc, { name, color }) => {
    return {
      ...acc,
      [name]: {
        title: name,
        x: [...Array(nbElements).keys()].map(() => " "),
        y: [...Array(nbElements).keys()].map(() => " "),
        style: {
          line: color,
        },
      },
    };
  }, {});

  component.update = function (name, value) {
    data[name].y.shift();
    data[name].y.push(value);
    component.setData(Object.keys(data).map((key) => data[key]));
    this.emit("updated");
  };

  return component;
}

module.exports = timeline;
