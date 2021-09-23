setInterval(() => {
  process.send({ eventName: "memory", data: process.memoryUsage() });
}, 1000);
