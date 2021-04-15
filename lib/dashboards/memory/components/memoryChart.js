const lineChart = require("../../../widgets/lineChart");

const toMB = (data) => data / 1024 / 1024;

module.exports = (events, options = {}) => {
  let widget = lineChart(
    [
      { name: "rss", color: "red" },
      { name: "heapTotal", color: "yellow" },
      { name: "heapUsed", color: "green" },
    ],
    { label: "Memory (MB)", ...options }
  );

  events.on("memory", (usage) => {
    widget.update("rss", toMB(usage.rss));
    widget.update("heapTotal", toMB(usage.heapTotal));
    widget.update("heapUsed", toMB(usage.heapUsed));
  });

  return widget;
};
