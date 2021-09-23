# dashrun

Run a node.js script and watch process execution on a terminal dashboard.

```shell
npx dashrun your_script.js [arg...]
```

dashrun comes with a built-in memory dashboard and allows you to create custom ones.

![image](https://user-images.githubusercontent.com/221211/113982536-2d00e500-9849-11eb-83b9-7bf2c5fdee0a.png)

## Create a custom dashboard

### Probe

You need first to create a `probe` to send message from the forked process to the dashboard.

A probe can be a simple line of code in your script:

```js
let message = { eventName: "myEvent", data: Math.random() };
process.send(message);
```

or a file:

```js
//myProbe.js (dashrun will automatically inject this file into your script)
setInterval(() => {
  //Sending every second to the dashboard a message with a random value
  process.send({ eventName: "myEvent", data: Math.random() });
}, 1000);
```

Note that message must be sent
with [process.send](https://nodejs.org/api/process.html#process_process_send_message_sendhandle_options_callback)
core function.

### Dashboard

A dashboard is a function whose role is to ensure that the events sent by the script are rendered on the terminal

```js
module.exports = (run) => {
  //Render something, run the script and then listen to events
};
```

You are free to use any library to create a dashboard. 
[blessed-contrib](https://www.npmjs.com/package/blessed-contrib) is a good choice and dashrun comes with a thin layer
over it to ease dashboard construction.

```js
const path = require("path");
const contrib = require("blessed-contrib");
const { DashboardLayout } = require("dashrun");

module.exports = (run) => {

  //Create a layout and define area where bless-contrib components will be rendered
  let layout = new DashboardLayout();
  let top = layout.area(0, 0, 6, 12);

  //Create a component, add it to layout and then render
  let component = contrib.lcd({
    label: "Current value",
    color: "red",
    ...top, //Set area
  });
  layout.add(component);
  layout.render();

  //Run the script with your custom probe
  let probe = path.join(__dirname, "myProbe.js");
  let script = run([probe]);

  //Listen to events sent by the probe and update component
  script.on("myEvent", (data) => {
    component.setDisplay(data);
    layout.render();
  });
};
```
