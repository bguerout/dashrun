const { Readable } = require("stream");

function byteToMB(value) {
  return Math.round((value / 1024 / 1024) * 100) / 100;
}

module.exports = (options = {}) => {
  let stream = new Readable({
    objectMode: true,
    read() {},
  });
  stream.stop = () => stream.push(null);

  function probe(options) {
    let rss = process.memoryUsage.rss ? process.memoryUsage.rss() : process.memoryUsage().rss;
    let convertBytes = options.convertBytes || byteToMB;

    stream.push(convertBytes(rss));
    setTimeout(() => probe(options), options.frequency || 2500).unref();
  }
  probe(options);

  return stream;
};
