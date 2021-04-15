const max = require("../../../widgets/max");

const toMB = (data) => data / 1024 / 1024;

module.exports = (events, options = {}) => {
  let widget = max({ label: "Max RSS (MB)", ...options });

  events.on("memory", (usage) => {
    widget.update(toMB(usage.rss));
  });

  return widget;
};
