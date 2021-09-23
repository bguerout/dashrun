setTimeout(() => {
  process.send({ eventName: "test", data: process.argv });
}, 50);
