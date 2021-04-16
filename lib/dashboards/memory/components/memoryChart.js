const lineChart = require("../../../blessed/widgets/lineChart");

const toMB = (data) => data / 1024 / 1024;

module.exports = (script, options = {}) => {
  let widget = lineChart(
    [
      { name: "rss", color: "red" },
      { name: "heapTotal", color: "yellow" },
      { name: "heapUsed", color: "green" },
    ],
    { label: "Memory (MB)", ...options }
  );

  script.on("memory", (usage) => {
    widget.update("rss", toMB(usage.rss));
    widget.update("heapTotal", toMB(usage.heapTotal));
    widget.update("heapUsed", toMB(usage.heapUsed));
  });

  return widget;
};
