// eslint-disable-next-line node/no-unpublished-require
const waitUntil = require("wait-until");
const assert = require("assert");
const path = require("path");
const fork = require("../lib/fork");

function getUtilFile(filename) {
  return path.join(__dirname, "utils", filename);
}

describe(__filename, () => {
  let probe = getUtilFile("test-probe.js");

  it("can get message from the forked script", (done) => {
    let script = getUtilFile("stdout.js");

    let { events } = fork(script, { probe });

    events.on("test", (data) => {
      assert.strictEqual(data, "message sent from child");
      done();
    });
  });

  it("can get stdout from the forked script", (done) => {
    let script = getUtilFile("stdout.js");

    let { events } = fork(script, { probe });

    let logs = [];
    events.on("log", (chunk) => {
      logs.push(chunk.toString());
      if (logs.length >= 2) {
        assert.deepStrictEqual(logs, ["message from stdout\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can get stderr from the forked script", (done) => {
    let script = getUtilFile("stderr.js");

    let { events } = fork(script, { probe });

    let logs = [];
    events.on("log", (chunk) => {
      logs.push(chunk.toString());
      if (logs.length >= 2) {
        assert.deepStrictEqual(logs, ["message from stderr\n", "Script exits with code 0"]);
        done();
      }
    });
  });

  it("can handle script with error", (done) => {
    let script = getUtilFile("error.js");

    let { events } = fork(script, { probe });

    let logs = [];
    events.on("log", (chunk) => logs.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(10)
      .condition(() => {
        return logs.find((l) => l.indexOf("this is an error") !== -1);
      })
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });

  it("can handle script with async error", (done) => {
    let script = getUtilFile("async-error.js");

    let { events } = fork(script, { probe });

    let logs = [];
    events.on("log", (chunk) => logs.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(50)
      .condition(() => logs.find((l) => l.indexOf("this is an async error") !== -1))
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });

  it("can handle exit code", (done) => {
    let script = getUtilFile("exit.js");

    let { events } = fork(script, { probe });

    let logs = [];
    events.on("log", (chunk) => logs.push(chunk.toString()));

    waitUntil()
      .interval(10)
      .times(50)
      .condition(() => logs.find((l) => l.indexOf("Script exits with code 1") !== -1))
      .done(async (result) => {
        result ? done() : assert.fail("timeout");
      });
  });
});
