const babar = require("babar");
const readline = require("readline");
const { promisify } = require("util");
const moveCursor = promisify(readline.moveCursor);
const cursorTo = promisify(readline.cursorTo);
const clearScreenDown = promisify(readline.clearScreenDown);

class Graph {
  constructor(stream, options = {}) {
    this.coordinates = options.coordinates || [[0, 0]];
    this.height = options.height || 20;
    this.width = 80;
    this.options = options;
    this.stream = stream;
    this.rendered = false;
  }

  async render(coordinates) {
    if (this.rendered) {
      await cursorTo(this.stream, 0);
      await moveCursor(this.stream, 0, -1 * (this.height - 1));
      await clearScreenDown(this.stream);
    }

    let content = babar(coordinates, {
      color: "green",
      width: this.width,
      height: this.height,
      xFractions: 0,
      yFractions: 0,
      ...this.options,
    });

    this.rendered = true;
    return new Promise((resolve, reject) => {
      this.stream.write(content, (e) => (e ? reject(e) : resolve()));
    });
  }

  shift() {
    this.coordinates.shift();
    let previous = this.coordinates.shift();
    let x = previous[0];
    this.coordinates.unshift([x, 0]); //Needs to insert a fake coordinates to force graph to have y axis from 0
  }

  async add(y) {
    let length = this.coordinates.length;
    let x = this.coordinates[length - 1][0] + 1;
    this.coordinates.push([x, y]);

    if (length <= 1) {
      return;
    }

    if (length > (this.width - 1) / 2) {
      this.shift();
    }

    return this.render(this.coordinates);
  }
}

module.exports = Graph;
