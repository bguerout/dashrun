const path = require("path");
const EventEmitter = require("events");
const child_process = require("child_process");

function parseParams(...args) {
  let last = args[args.length - 1];
  let options = typeof last === "object" ? args.pop() : {};

  return {
    script: args[0],
    args: args[1],
    options,
  };
}

function fork(...params) {
  let { script, args, options } = parseParams(...params);
  let events = new EventEmitter();
  let probe = options.probe || path.join(__dirname, "probe.js");

  let child = child_process.fork(script, args, {
    cwd: process.cwd(),
    silent: true,
    execArgv: ["-r", probe],
  });

  child.on("message", (message) => {
    events.emit(message.type, message.data);
  });

  child.stderr.on("data", (chunk) => {
    events.emit("log", chunk);
  });

  child.stdout.on("data", (chunk) => {
    events.emit("log", chunk);
  });

  child.on("error", (e) => {
    events.emit("log", e.message);
  });

  child.on("exit", (code) => {
    events.emit("log", `Script exits with code ${code}`);
  });

  return { events };
}

module.exports = fork;
