const crypto = require("crypto");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 1000);
  });
}

async function emulateWork(sleepMs = 2500) {
  let data = [];
  for (let i = 0; i < 200000; i++) {
    data.push(crypto.randomBytes(4096).toString("hex"));
    console.log(`Dummy data added into memory ${data.length}. Waiting ${sleepMs}ms`);
    await sleep(sleepMs);
  }
}

emulateWork(parseInt(process.argv[2]) || 250);
