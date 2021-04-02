# outofmemory

Watch memory usage of a node.js script from CLI

Graphs are generated with [babar](https://github.com/stephan83/babar) and are streamed to `stderr` to prevent `stdout` to
be [cluttered](https://www.pixelstech.net/article/1326560863-When-to-use-STDERR-instead-of-STDOUT)


```shell
npx memory-usage your_script.js > script.log
```
