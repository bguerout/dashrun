const EventEmitter = require("events");
const child_process = require("child_process");

function runScript(script, probes, options = {}) {
  let events = new EventEmitter();
  let scriptArgs = options.scriptArgs || [];

  let child = child_process.fork(script, scriptArgs, {
    cwd: process.cwd(),
    silent: true,
    execArgv: probes.reduce((acc, probe) => {
      //No flapMap in nodejs 10.x
      acc.push("-r");
      acc.push(probe);
      return acc;
    }, []),
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

  events.cmd = `$ node ${script} ${scriptArgs.join(" ")}`;
  return events;
}

module.exports = runScript;
