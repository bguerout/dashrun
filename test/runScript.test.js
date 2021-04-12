// eslint-disable-next-line node/no-unpublished-require
const waitUntil = require("wait-until");
const assert = require("assert");
const runScript = require("../lib/runScript");
const { getScript, getProbe } = require("./utils/testUtils");

describe(__filename, () => {
  let probes = [getProbe("noop-probe.js")];

  it("can get message from the running script", (done) => {
    let script = getScript("stdout.js");

    let { events } = runScript(script, [getProbe("message-probe.js")]);

    events.on("test", (data) => {
      assert.strictEqual(data, "message sent from child");
      done();
    });
  });

  it("can run script with args", (done) => {
    let script = getScript("noop.js");

    let { events } = runScript(script, [getProbe("argv-probe.js")], { scriptArgs: ["param1"] });

    events.on("test", (argv) => {
      assert.strictEqual(argv[2], "param1");
      done();
    });
  });

  it("can get stdout from the running script", (done) => {
    let script = getScript("stdout.js");

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
    let script = getScript("stderr.js");

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
    let script = getScript("error.js");

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
    let script = getScript("async-error.js");

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
    let script = getScript("exit.js");

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
