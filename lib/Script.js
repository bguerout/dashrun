const EventEmitter = require("events");
const child_process = require("child_process");

class Script extends EventEmitter {
  constructor(file, options = {}) {
    super();

    this.file = file;
    this.scriptArgs = options.scriptArgs || [];
    this.cmd = `$ node ${file} ${this.scriptArgs.join(" ")}`;
  }

  run(probes) {
    let child = child_process.fork(this.file, this.scriptArgs, {
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
      this.emit(message.type, message.data);
    });

    child.stderr.on("data", (chunk) => {
      this.emit("output", chunk);
    });

    child.stdout.on("data", (chunk) => {
      this.emit("output", chunk);
    });

    child.on("error", (e) => {
      this.emit("output", e.message);
    });

    child.on("exit", (code) => {
      this.emit("output", `Script exits with code ${code}`);
    });

    return child;
  }
}

module.exports = Script;
