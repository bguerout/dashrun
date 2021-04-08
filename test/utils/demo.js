const crypto = require("crypto");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 1000);
  });
}

async function emulateWork(sleepMs = 2500) {
  for (let i = 0; i < 200000; i++) {
    crypto.randomBytes(4096).toString("hex");
    await sleep(sleepMs);
  }
}

console.log(`stdout and stderr of the script are shown here`);
emulateWork(parseInt(process.argv[2]) || 250);
