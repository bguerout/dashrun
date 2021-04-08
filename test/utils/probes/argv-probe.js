setTimeout(() => {
  process.send({ type: "test", data: process.argv });
}, 50);
