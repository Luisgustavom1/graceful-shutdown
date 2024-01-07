const UNKNOWN_ERROR = 1;
const knownErrors = [
	{ exitCode: UNKNOWN_ERROR, event: 'uncaughtException' },
	{ exitCode: UNKNOWN_ERROR, event: 'unhandledRejection' },
];

const log = msg => console.log(`pid: [${process.pid}] - ${msg}`);

process.on("exit", code => {
	// do some cleanup
	// like closing db connections, etc
	// to not allow users to do some actions
	log(`Server closed with success`)
	log(`DB closed with success`)
	process.exit(code)
})

knownErrors.forEach(({ exitCode, event }) => {
	process.on(event, (error) => {
		log(`Process exiting due to ${event} with error: ${error}`);
		if (exitCode === UNKNOWN_ERROR) {
			return process.exit(exitCode);
		}

		process.exit(exitCode);
	})
})

log('Process started');	

let counter = 0;
const connectToDB = async () => {
	const random = Math.random();
	if (random > 0.5) {
		return Promise.reject("Could not connect to DB");
	}
	log('DB connect with success');	
	if (++counter > 3) process.exit(0); 
}

setInterval(() => connectToDB(), 200);

