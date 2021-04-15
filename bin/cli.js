#!/usr/bin/env node
const { program } = require("commander");
const runScript = require("../lib/runScript");

const dashboards = {
  memory: require("../lib/dashboards/memory"),
};

function getScriptArgs(script) {
  let index = process.argv.findIndex((arg) => arg === script);
  return process.argv.slice(index + 1, process.argv.length);
}

program
  .arguments("<script>")
  .option("-d, --dashboard <dashboard>", "The name of the dashboard to use (default: memory)", "memory")
  .description("Run the node.js script and render a dashboard with memory usage", {
    script: "The script.js to run",
  })
  .action((script, { dashboard }) => {
    dashboards[dashboard]((probes = []) => {
      return runScript(script, probes, { scriptArgs: getScriptArgs(script) });
    });
  });

program.parse(process.argv);
