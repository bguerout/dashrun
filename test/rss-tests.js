const assert = require("assert");
const { oleoduc, writeData } = require("oleoduc");
const rss = require("../lib/probes/rss");

describe(__filename, () => {
  it("should get rss memory usage", async () => {
    let results = [];
    let stream = rss({ frequency: 100 });

    await oleoduc(
      stream,
      writeData((data) => {
        stream.stop();
        results.push(data);
      })
    );

    assert.strictEqual(results.length, 1);
    assert.ok(!isNaN(results[0]));
  });

  it("should get rss memory usage with custom rss byte conversion", async () => {
    let results = [];
    let stream = rss({
      frequency: 100,
      convertBytes(v) {
        return -1 * v;
      },
    });

    await oleoduc(
      stream,
      writeData((data) => {
        stream.stop();
        results.push(data);
      })
    );

    assert.strictEqual(Math.sign(results[0]), -1);
  });
});
