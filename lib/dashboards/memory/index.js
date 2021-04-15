const path = require("path");
const DashboardLayout = require("../../DashboardLayout");
const maxRss = require("./components/maxRss");
const memoryChart = require("./components/memoryChart");
const output = require("./components/output");

const probes = [path.join(__dirname, "memoryUsageProbe.js")];

module.exports = (run) => {
  let { cmd, events } = run(probes);

  let layout = new DashboardLayout();
  let topLeft = layout.area(0, 0, 6, 6);
  let topRight = layout.area(0, 6, 6, 6);
  let bottom = layout.area(6, 0, 6, 12);

  layout.add(memoryChart(events, topLeft));
  layout.add(maxRss(events, topRight));
  layout.add(output(events, { label: cmd, ...bottom }));

  layout.render();
};
