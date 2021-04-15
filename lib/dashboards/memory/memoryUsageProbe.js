setInterval(() => {
  process.send({ type: "memory", data: process.memoryUsage() });
}, 1000);
