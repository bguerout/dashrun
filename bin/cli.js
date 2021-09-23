#!/usr/bin/env node
const { program } = require("commander");
const path = require("path");
const Script = require("../lib/Script");

const dashboards = {
  memory: require("../lib/dashboards/memory"),
};

program
  .passThroughOptions()
  .arguments("<file> [args...]")
  .description("Run a node.js script and watch process execution on a terminal dashboard.", {
    file: "The script file to run",
    args: "The arguments needed by the script file",
  })
  .option("-d, --dashboard <dashboard>", "The name of the dashboard to use or a path to a dashboard file", "memory")
  .action((file, args, { dashboard }) => {
    let script = new Script(file, { scriptArgs: args });
    const dash = dashboards[dashboard] || require(path.join(process.cwd(), dashboard));
    dash(script);
  });

program.parse(process.argv);
