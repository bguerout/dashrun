#!/usr/bin/env node
const { program } = require("commander");
const Script = require("../lib/Script");

const dashboards = {
  memory: require("../lib/dashboards/memory"),
};

program
  .passThroughOptions()
  .arguments("<file> [args...]")
  .option("-d, --dashboard <dashboard>", "The name of the dashboard to use (default: memory)", "memory")
  .description("Run the node.js script and render a dashboard with memory usage", {
    file: "The script file to run",
    args: "The arguments needed by the script file",
  })
  .action((file, args, { dashboard }) => {
    let script = new Script(file, { scriptArgs: args });
    dashboards[dashboard](script);
  });

program.parse(process.argv);
