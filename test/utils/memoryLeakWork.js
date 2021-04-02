const crypto = require("crypto");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 1000);
  });
}

async function emulateWork(sleepMs = 2500) {
  let data = [];
  for (let i = 0; i < 2000; i++) {
    data.push(crypto.randomBytes(4096).toString("hex"));
    console.log(`Dummy data generated  ${data.length}`);
    await sleep(sleepMs);
  }
}
emulateWork(parseInt(process.argv[1]) || 512);
