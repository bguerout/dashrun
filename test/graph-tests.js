const assert = require("assert");
const { Writable } = require("stream");
const Graph = require("../lib/Graph");

function createWritableStream(callback) {
  return new Writable({
    objectMode: false,
    write: (data, _, done) => {
      callback(data);
      done();
    },
  });
}

describe(__filename, () => {
  it("should generate graph", async () => {
    let output = "";
    let stream = createWritableStream((data) => {
      output += data;
    });
    let graph = new Graph(stream);

    await graph.add(99999);

    assert.ok(output.indexOf("99999") !== -1);
    assert.ok(output.indexOf("\x1B[30m") !== -1);
  });
});
