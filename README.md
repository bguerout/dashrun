# dashrun

Run a node.js script and watch process execution on a terminal dashboard.

```shell
npx dashrun your_script.js [arg...]
```

dashrun comes with a built-in memory dashboard and allows you to create custom ones.

![image](https://user-images.githubusercontent.com/221211/113982536-2d00e500-9849-11eb-83b9-7bf2c5fdee0a.png)

## Create a custom dashboard

### Probe

You need first to create a `probe` to send data from the forked process to the dashboard.

A probe can be a simple line of code in your script:

```js
process.send({ type: "memory", data: process.memoryUsage() });
```

or a file:

```js
//myProbe.js (Dashrun will automatically inject this file into your script)
setInterval(() => {
  //Sending every second to the dashboard the memory usage of the forked script
  process.send({ type: "memory", data: process.memoryUsage() });
}, 1000);
```

Note that data must be sent
with [process.send](https://nodejs.org/api/process.html#process_process_send_message_sendhandle_options_callback)
core function.

### Dashboard

You are free to use any library to create a dashboard but we
suggest [blessed-contrib](https://www.npmjs.com/package/blessed-contrib)

Dashrun comes with a thin layer over blessed-contrib to ease dashboard construction.

```js
const path = require("path");
const contrib = require("blessed-contrib");
const { Layout } = require("dashrun");

//A dashboard is just a function taking a callback to run the script as its first argument
module.exports = (run) => {

  //Create a layout and define area where component will be rendered
  let layout = new Layout();
  let top = layout.area(0, 0, 6, 12);

  //Create a component (using bless-contrib)
  let component = contrib.lcd({
    label: "Current value",
    color: "red",
    ...top,
  });
  layout.add(component);
  layout.render();

  //Run the script
  let probe = path.join(__dirname, "myProbe.js");
  let { events } = run([probe]);

  //Listen to event sent by the probe and update component
  events.on("memory", (usage) => {
    component.setDisplay(usage.rss);
    layout.render();
  });
};
```
