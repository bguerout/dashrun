const max = require("../../../blessed/widgets/max");

const toMB = (data) => data / 1024 / 1024;

module.exports = (script, options = {}) => {
  let widget = max({ label: "Max RSS (MB)", ...options });

  script.on("memory", (usage) => {
    widget.update(toMB(usage.rss));
  });

  return widget;
};
