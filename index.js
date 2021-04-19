module.exports = {
  runScript: require("./lib/runScript"),
  DashboardLayout: require("./lib/blessed/DashboardLayout"),
  components: {
    memoryChart: require("./lib/dashboards/memory/components/memoryChart"),
    maxRss: require("./lib/dashboards/memory/components/maxRss"),
    output: require("./lib/dashboards/memory/components/output"),
  },
  widgets: {
    memory: require("./lib/blessed/widgets/timeline"),
    logger: require("./lib/blessed/widgets/logger"),
    max: require("./lib/blessed/widgets/max"),
  },
};
