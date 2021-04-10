// eslint-disable-next-line node/no-unpublished-require
const waitUntil = require("wait-until");
const assert = require("assert");
const path = require("path");
const runScript = require("../lib/runScript");

function getUtilFile(filename) {
  return path.join(__dirname, "utils", filename);
}

describe(__filename, () => {
  let probes = [getUtilFile("probes/noop-probe.js")];

  it("can get message from the running script", (done) => {
    let script = getUtilFile("stdout.js");

    let { events } = runScript(script, [getUtilFile("probes/message-probe.js")]);

    events.on("test", (data) => {
      assert.strictEqual(data, "message sent from child");
      done();
    });
  });

  it("can run script with args", (done) => {
    let script = getUtilFile("noop.js");

    let { events } = runScript(script, [getUtilFile("probes/argv-probe.js")], { argv: ["param1"] });

    events.on("test", (argv) => {
      assert.strictEqual(argv[2], "param1");
      done();
    });
  });

  it("can get stdout from the running script", (done) => {
    let script = getUtilFile("stdout.js");

    let { events } = runScript(script, probes);

    let output = [];
    events.on("output", (chunk) => {
      output.push(chunk.toString());
      if (output.length >= 2) {
        assert.deepStrictEqual(output, ["message from stdout\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can get stderr from the running script", (done) => {
    let script = getUtilFile("stderr.js");

    let { events } = runScript(script, probes);

    let output = [];
    events.on("output", (chunk) => {
      output.push(chunk.toString());
      if (output.length >= 2) {
        assert.deepStrictEqual(output, ["message from stderr\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can handle script with error", (done) => {
    let script = getUtilFile("error.js");

    let { events } = runScript(script, probes);

    let output = [];
    events.on("output", (chunk) => output.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(10)
      .condition(() => {
        return output.find((l) => l.indexOf("this is an error") !== -1);
      })
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });

  it("can handle script with async error", (done) => {
    let script = getUtilFile("async-error.js");

    let { events } = runScript(script, probes);

    let output = [];
    events.on("output", (chunk) => output.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(50)
      .condition(() => output.find((l) => l.indexOf("this is an async error") !== -1))
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });

  it("can handle exit code", (done) => {
    let script = getUtilFile("exit.js");

    let { events } = runScript(script, probes);

    let output = [];
    events.on("output", (chunk) => output.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(50)
      .condition(() => output.find((l) => l.indexOf("Script exits with code 1") !== -1))
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });
});
