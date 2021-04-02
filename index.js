const { oleoduc, writeData } = require("oleoduc");
const Graph = require("./lib/Graph");
const rss = require("./lib/probes/rss");

function measure(options = {}) {
  let { output = process.stderr, ...probeOptions } = options;
  let graph = new Graph(output);

  return oleoduc(
    rss(probeOptions),
    writeData((data) => graph.add(data)),
    { promisify: false }
  );
}

module.exports = { measure };
