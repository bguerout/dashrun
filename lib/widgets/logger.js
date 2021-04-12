const contrib = require("blessed-contrib");

function logger(options = {}) {
  let component = contrib.log({
    label: "Logger",
    fg: "green",
    selectedFg: "green",
    ...options,
  });

  component.update = function (data) {
    let lines = data.toString().trim().split(/\r?\n/);
    lines.forEach((line) => component.log(line));
    this.emit("updated");
  };

  return component;
}

module.exports = logger;
