#!/usr/bin/env node
const { program } = require("commander");
const dashboard = require("../lib/memory/dashboard");
const runScript = require("../lib/runScript");

function getScriptArgv(script) {
  let index = process.argv.findIndex((arg) => arg === script);
  return process.argv.slice(index + 1, process.argv.length);
}

program
  .arguments("<script>")
  .description("Run the node.js script and render a dashboard with memory usage", {
    script: "The script.js to run",
  })
  .action((script) => {
    let argv = getScriptArgv(script);

    dashboard.show((probes) => {
      return runScript(script, probes, { argv });
    });
  });

program.parse(process.argv);
