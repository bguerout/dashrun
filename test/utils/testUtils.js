const path = require("path");

module.exports = {
  getScriptFile: function (filename) {
    return path.join(__dirname, "scripts", filename);
  },
  getProbeFile: function (filename) {
    return path.join(__dirname, "probes", filename);
  },
};
