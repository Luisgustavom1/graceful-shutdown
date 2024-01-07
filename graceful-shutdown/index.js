import { createServer } from 'node:http';
import { once } from 'node:events';

async function handler(req, res) {
  try {
    const data = JSON.parse(await once(req, 'data'));
    console.log("\nreceived", data);

    setTimeout(() => {
      throw new Error('will be handled by uncaughtException');
    }, 1000);
    await Promise.reject("will be handled by unhandledRejection");

    res.writeHead(200);
    res.end(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end();
  }
};

const server = createServer(handler).listen(3000).on('listening', () => {
  console.log('Server listening on port 3000')
});

const signalWithSuccessfullyExitCode = ["SIGINT", "SIGTERM"];

function gracefulShutdown(event) {
  return (code) => {
    console.log(`${event} received with ${code}`);
    server.close(() => {
      console.log("server closed");
      console.log("close db connection");
    });

    const successSignal = signalWithSuccessfullyExitCode.includes(event);
    if (successSignal) process.exit(0); 
  }
}

process.on("uncaughtException", (error, origin) => {
  console.log(`uncaughtException: ${error} - ${origin}`);
})

process.on("unhandledRejection", async (reason) => {
  console.log(`unhandledRejection: ${reason}`);
})

// Ctrl + C
process.on("SIGINT", gracefulShutdown("SIGINT"))

// on kill -> windows not support
process.on("SIGTERM", gracefulShutdown("SIGTERM"))

// on kill -> windows not support
process.on("exit", code => {
  console.log("\exit signal received", code);
})