const path = require("path");
const EventEmitter = require("events");
const child_process = require("child_process");

function fork(script, options = {}) {
  let events = new EventEmitter();
  let probe = options.probe || path.join(__dirname, "probe.js");

  let child = child_process.fork(script, options.argv || [], {
    cwd: process.cwd(),
    silent: true,
    execArgv: ["-r", probe],
  });

  child.on("message", (message) => {
    events.emit(message.type, message.data);
  });

  child.stderr.on("data", (chunk) => {
    events.emit("output", chunk);
  });

  child.stdout.on("data", (chunk) => {
    events.emit("output", chunk);
  });

  child.on("error", (e) => {
    events.emit("output", e.message);
  });

  child.on("exit", (code) => {
    events.emit("output", `Script exits with code ${code}`);
  });

  return { events };
}

module.exports = fork;
