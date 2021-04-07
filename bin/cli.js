#!/usr/bin/env node
const { program } = require("commander");
const { start } = require("../index");

function getScriptArgs(script) {
  let index = process.argv.findIndex((arg) => arg === script);
  return process.argv.slice(index + 1, process.argv.length);
}

program
  .arguments("<script>")
  .description("Run the node.js script and watch its memory usage", {
    script: "The script.js to run and watch",
  })
  .action((script) => {
    let args = getScriptArgs(script);
    start(script, args);
  });

program.parse(process.argv);
