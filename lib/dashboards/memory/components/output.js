const logger = require("../../../blessed/widgets/logger");

module.exports = (script, options = {}) => {
  let widget = logger({ label: script.cmd, ...options });

  script.on("output", (chunk) => {
    widget.update(chunk.toString());
  });

  return widget;
};
