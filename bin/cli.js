#!/usr/bin/env node
const path = require("path");
const { program } = require("commander");
const { measure } = require("../index");

function sanitizeArgv(script) {
  //Make process.argv the same as if this script was executed with node command
  let index = process.argv.findIndex((arg) => arg === script);
  process.argv.splice(0, index);
}
program
  .arguments("<script>")
  .option("--frequency <frequency>", "The frequency in ms to request memory usage", 2500)
  .description("Start to measure memory usage", {
    script: "The script.js to watch",
  })
  .action((script, { frequency }) => {
    measure({ frequency });
    sanitizeArgv(script);
    require(path.resolve(script));
  });

program.parse(process.argv);
