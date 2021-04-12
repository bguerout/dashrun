const blessed = require("blessed");

function createDefaultScreen() {
  let screen = blessed.screen({ output: process.stderr });
  screen.key(["escape", "q", "C-c"], () => {
    // eslint-disable-next-line no-process-exit
    return process.exit(0);
  });
  return screen;
}

function throttle(func, timeFrame) {
  let lastTime = 0;
  return function () {
    let now = new Date();
    if (now - lastTime >= timeFrame) {
      func();
      lastTime = now;
    }
  };
}

class DashboardLayout {
  constructor(options = {}) {
    this.components = new Set();
    this.rows = options.rows || 12;
    this.cols = options.cols | 12;
    this.dashboardMargin = options.dashboardMargin || 0;

    this.screen = options.screen || createDefaultScreen();
    this.screen.on("resize", () => {
      this.components.forEach((w) => w.emit("attach"));
    });
    this.screen.render();

    this.refresh = throttle(this.screen.render.bind(this.screen), options.throttleMs || 250);
  }

  /**
   * This code has been extracted from contrib.grid
   * contrib.grid is not a real grid but a widget builder which enforce widget position.
   * Instead of using a grid, we expose an area function to allow user to set the position of theirs widgets/components
   */
  area(row, col, rowSpan, colSpan) {
    let areaHeight = (100 - this.dashboardMargin * 2) / this.rows;
    let areaWidth = (100 - this.dashboardMargin * 2) / this.cols;
    let areaSpacing = 0;
    let top = row * areaHeight + this.dashboardMargin;
    let left = col * areaWidth + this.dashboardMargin;

    return {
      top: top + "%",
      left: left + "%",
      width: areaWidth * colSpan - areaSpacing + "%",
      height: areaHeight * rowSpan - areaSpacing + "%",
      border: { type: "line", fg: "cyan" },
    };
  }

  add(widget) {
    widget.on("updated", this.refresh);
    this.screen.append(widget);
    this.components.add(widget);
  }

  render() {
    this.screen.render();
  }
}

module.exports = DashboardLayout;
