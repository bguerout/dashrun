// eslint-disable-next-line node/no-unpublished-require
const waitUntil = require("wait-until");
const assert = require("assert");
const Script = require("../lib/Script");
const { getScriptFile, getProbeFile } = require("./utils/testUtils");

let probes = [getProbeFile("noop-probe.js")];

describe(__filename, function () {
  it("can get message from the running script", function (done) {
    let file = getScriptFile("stdout.js");
    let script = new Script(file);

    script.run([getProbeFile("message-probe.js")]);

    script.on("test", (data) => {
      assert.strictEqual(data, "message sent from child");
      done();
    });
  });

  it("can run script with args", function (done) {
    let file = getScriptFile("noop.js");
    let script = new Script(file, { scriptArgs: ["param1"] });

    script.run([getProbeFile("argv-probe.js")]);

    script.on("test", (argv) => {
      assert.strictEqual(argv[2], "param1");
      done();
    });
  });

  it("can get stdout from the running script", function (done) {
    let file = getScriptFile("stdout.js");
    let script = new Script(file);

    script.run(probes);

    let output = [];
    script.on("output", (chunk) => {
      output.push(chunk.toString());
      if (output.length >= 2) {
        assert.deepStrictEqual(output, ["message from stdout\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can get stderr from the running script", function (done) {
    let file = getScriptFile("stderr.js");
    let script = new Script(file);

    script.run(probes);

    let output = [];
    script.on("output", (chunk) => {
      output.push(chunk.toString());
      if (output.length >= 2) {
        assert.deepStrictEqual(output, ["message from stderr\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can handle script with error", function (done) {
    let file = getScriptFile("error.js");
    let script = new Script(file);

    script.run(probes);

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

  it("can handle script with async error", function (done) {
    let file = getScriptFile("async-error.js");
    let script = new Script(file);

    script.run(probes);

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

  it("can handle exit code", function (done) {
    let file = getScriptFile("exit.js");
    let script = new Script(file);

    script.run(probes);

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
