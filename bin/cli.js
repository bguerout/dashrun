#!/usr/bin/env node
const { program } = require("commander");
const { start } = require("../index");

function getScriptArgs(script) {
  let index = process.argv.findIndex((arg) => arg === script);
  return process.argv.slice(index + 1, process.argv.length);
}

program
  .arguments("<script>")
  .description("Start to measure memory usage", {
    script: "The script.js to watch",
  })
  .action((script) => {
    let args = getScriptArgs(script);
    start(script, args);
  });

program.parse(process.argv);
