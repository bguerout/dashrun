const path = require("path");

module.exports = {
  getScript: function (filename) {
    return path.join(__dirname, "scripts", filename);
  },
  getProbe: function (filename) {
    return path.join(__dirname, "probes", filename);
  },
};
