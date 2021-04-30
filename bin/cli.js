#!/usr/bin/env node
const { program } = require("commander");
const Script = require("../lib/Script");

const dashboards = {
  memory: require("../lib/dashboards/memory"),
};

function getScriptArgs(script) {
  let index = process.argv.findIndex((arg) => arg === script);
  return process.argv.slice(index + 1, process.argv.length);
}

program
  .arguments("<file>")
  .option("-d, --dashboard <dashboard>", "The name of the dashboard to use (default: memory)", "memory")
  .description("Run the node.js script and render a dashboard with memory usage", {
    file: "The script file to run",
  })
  .action((file, { dashboard }) => {
    let script = new Script(file, { scriptArgs: getScriptArgs(file) });
    dashboards[dashboard](script);
  });

program.parse(process.argv);
