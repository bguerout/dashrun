setTimeout(() => {
  process.send({ type: "test", data: "message sent from child" });
}, 50);
