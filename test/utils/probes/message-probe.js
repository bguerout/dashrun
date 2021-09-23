setTimeout(() => {
  process.send({ eventName: "test", data: "message sent from child" });
}, 50);
