const contrib = require("blessed-contrib");

function max(options = {}) {
  let { maxValue = 0, nbDigits = 6, ...rest } = options;
  let empty = [...Array(nbDigits - 1).keys()].map(() => " ");

  let component = contrib.lcd({
    label: "Max",
    color: "red",
    display: [...empty, "0"],
    segmentWidth: 0.06,
    segmentInterval: 0.1,
    elements: nbDigits,
    elementSpacing: 10,
    elementPadding: 2,
    ...rest,
  });

  component.update = function (newValue) {
    let value = Math.round(Math.max(maxValue, newValue));
    component.setDisplay(`${value}`.padStart(nbDigits, " "));
    this.emit("updated");
  };

  return component;
}

module.exports = max;
