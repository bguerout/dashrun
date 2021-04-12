module.exports = {
  runScript: require("./lib/runScript"),
  DashboardLayout: require("./lib/DashboardLayout"),
  components: {
    memoryChart: require("./lib/dashboards/memory/components/memoryChart"),
    maxRss: require("./lib/dashboards/memory/components/maxRss"),
    output: require("./lib/dashboards/memory/components/output"),
  },
  widgets: {
    memory: require("./lib/widgets/lineChart"),
    logger: require("./lib/widgets/logger"),
    max: require("./lib/widgets/max"),
  },
};
