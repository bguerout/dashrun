const blessed = require("blessed");
const contrib = require("blessed-contrib");

class Dashboard {
  constructor() {
    this.screen = blessed.screen({ output: process.stderr });
    this.screen.key(["escape", "q", "C-c"], () => {
      // eslint-disable-next-line no-process-exit
      return process.exit(0);
    });
    this.screen.on("resize", () => {
      this.widgets.forEach((w) => w.emit("attach"));
    });

    this.widgets = new Set();
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen });
  }

  activateMaxRss() {
    let nbDigits = 6;
    this.maxRss = this.grid.set(0, 6, 6, 6, contrib.lcd, {
      segmentWidth: 0.06,
      segmentInterval: 0.1,
      elements: nbDigits,
      display: "     0",
      elementSpacing: 10,
      elementPadding: 2,
      color: "red",
      label: "Max RSS (MB)",
    });
    this.data = 0;
    this.widgets.add(this.maxRss);

    return {
      set: (data) => {
        let value = Math.round(Math.max(this.data, data / 1024 / 1024));
        this.maxRss.setDisplay(`${value}`.padStart(nbDigits, " "));
      },
    };
  }

  activateMemory(types) {
    this.memory = this.grid.set(0, 0, 6, 6, contrib.line, {
      label: "Memory (MB)",
      width: 80,
      xLabelPadding: 3,
      xPadding: 5,
      showLegend: true,
      legend: { width: 12 },
    });
    this.widgets.add(this.memory);

    let lines = types.reduce((acc, { name, color }) => {
      return {
        ...acc,
        [name]: {
          title: name,
          x: [...Array(this.memory.width).keys()].map(() => " "),
          y: [...Array(this.memory.width).keys()].map(() => " "),
          style: {
            line: color,
          },
        },
      };
    }, {});

    return {
      addUsage: (name, data) => {
        lines[name].y.shift();
        lines[name].y.push(data / 1024 / 1024);
        this.memory.setData(Object.keys(lines).map((key) => lines[key]));
      },
    };
  }

  activateLogger(label) {
    this.log = this.grid.set(6, 0, 6, 12, contrib.log, { fg: "green", selectedFg: "green", label });
    this.widgets.add(this.log);

    return {
      add: (data) => {
        let lines = data.toString().trim().split(/\r?\n/);
        lines.forEach((line) => this.log.log(line));
      },
    };
  }

  render() {
    this.screen.render();
  }
}

module.exports = Dashboard;
