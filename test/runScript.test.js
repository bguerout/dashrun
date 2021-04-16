// eslint-disable-next-line node/no-unpublished-require
const waitUntil = require("wait-until");
const assert = require("assert");
const runScript = require("../lib/runScript");
const { getScriptFile, getProbeFile } = require("./utils/testUtils");

describe(__filename, () => {
  let probes = [getProbeFile("noop-probe.js")];

  it("can get message from the running script", (done) => {
    let file = getScriptFile("stdout.js");

    let script = runScript(file, [getProbeFile("message-probe.js")]);

    script.on("test", (data) => {
      assert.strictEqual(data, "message sent from child");
      done();
    });
  });

  it("can run script with args", (done) => {
    let file = getScriptFile("noop.js");

    let script = runScript(file, [getProbeFile("argv-probe.js")], { scriptArgs: ["param1"] });

    script.on("test", (argv) => {
      assert.strictEqual(argv[2], "param1");
      done();
    });
  });

  it("can get stdout from the running script", (done) => {
    let file = getScriptFile("stdout.js");

    let script = runScript(file, probes);

    let output = [];
    script.on("output", (chunk) => {
      output.push(chunk.toString());
      if (output.length >= 2) {
        assert.deepStrictEqual(output, ["message from stdout\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can get stderr from the running script", (done) => {
    let file = getScriptFile("stderr.js");

    let script = runScript(file, probes);

    let output = [];
    script.on("output", (chunk) => {
      output.push(chunk.toString());
      if (output.length >= 2) {
        assert.deepStrictEqual(output, ["message from stderr\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can handle script with error", (done) => {
    let file = getScriptFile("error.js");

    let script = runScript(file, probes);

    let output = [];
    script.on("output", (chunk) => output.push(chunk.toString()));

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
    let file = getScriptFile("async-error.js");

    let script = runScript(file, probes);

    let output = [];
    script.on("output", (chunk) => output.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(50)
      .condition(() => output.find((l) => l.indexOf("this is an async error") !== -1))
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });

  it("can handle exit code", (done) => {
    let file = getScriptFile("exit.js");

    let script = runScript(file, probes);

    let output = [];
    script.on("output", (chunk) => output.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(50)
      .condition(() => output.find((l) => l.indexOf("Script exits with code 1") !== -1))
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });
});
