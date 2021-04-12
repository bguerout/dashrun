const logger = require("../../../widgets/logger");

module.exports = (events, options = {}) => {
  let widget = logger({ label: "Logger", ...options });

  events.on("output", (chunk) => {
    widget.update(chunk.toString());
  });

  return widget;
};
