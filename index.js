const fork = require("./lib/fork");
const Dashboard = require("./lib/Dashboard");

function start(script, args) {
  let dashboard = new Dashboard();
  let maxRss = dashboard.activateMaxRss();
  let logger = dashboard.activateLogger();
  let memory = dashboard.activateMemory([
    { name: "rss", color: "red" },
    { name: "heapTotal", color: "yellow" },
    { name: "heapUsed", color: "green" },
  ]);

  dashboard.render();

  let { events } = fork(script, args);

  events.on("output", (chunk) => {
    logger.add(chunk.toString());
    dashboard.render();
  });

  events.on("memory", (usage) => {
    memory.addUsage("rss", usage.rss);
    memory.addUsage("heapTotal", usage.heapTotal);
    memory.addUsage("heapUsed", usage.heapUsed);
    maxRss.set(usage.rss);
    dashboard.render();
  });
}

module.exports = { start };
