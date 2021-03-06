const path = require("path");
const DashboardLayout = require("../../blessed/DashboardLayout");
const maxRss = require("./components/maxRss");
const memoryChart = require("./components/memoryChart");
const output = require("./components/output");

const probes = [path.join(__dirname, "memoryUsageProbe.js")];

module.exports = (script) => {
  let layout = new DashboardLayout();
  let topLeft = layout.area(0, 0, 6, 6);
  let topRight = layout.area(0, 6, 6, 6);
  let bottom = layout.area(6, 0, 6, 12);

  layout.add(memoryChart(script, { ...topLeft }));
  layout.add(maxRss(script, { ...topRight }));
  layout.add(output(script, { ...bottom }));
  layout.render();

  script.run(probes);
};
