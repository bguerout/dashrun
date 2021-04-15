process.nextTick(() => {
  throw new Error("this is an async error");
});
