#!/usr/bin/env node
const { program } = require("commander");
const { start } = require("../index");

function getScriptArgv(script) {
  let index = process.argv.findIndex((arg) => arg === script);
  return process.argv.slice(index + 1, process.argv.length);
}

program
  .arguments("<script>")
  .description("Run the node.js script and watch its memory usage", {
    script: "The script.js to run and watch",
  })
  .action((script) => {
    let argv = getScriptArgv(script);
    start(script, argv);
  });

program.parse(process.argv);
