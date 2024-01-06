import { spawn } from 'node:child_process'

const prepareLog = pid => msg => console.log(`pid: [${pid}] - ${msg}`);

const INSTANCES = 3;

function spinUpInstance() {
  const cp = spawn("node", ["server.js"]);
  const log = prepareLog(process.pid);
  log("Starting new instance");
  cp.stdout.on("data", data => console.log(data.toString().trim()));
  cp.on("exit", code => {
    log(`exited with code ${code}`);
    if (code === 0) { // 0 means success
      return;
    }
    spinUpInstance() // restart the instance
  })
}

for (let i = 0; i < INSTANCES; i++) {
  spinUpInstance();
}