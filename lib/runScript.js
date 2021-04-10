const EventEmitter = require("events");
const child_process = require("child_process");

function runScript(script, probes, options = {}) {
  let events = new EventEmitter();
  let argv = options.argv || [];

  let child = child_process.fork(script, argv, {
    cwd: process.cwd(),
    silent: true,
    execArgv: probes.flatMap((p) => ["-r", p]),
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

  return {
    cmd: `$ node ${script} ${argv.join(" ")}`,
    events,
  };
}

module.exports = runScript;
