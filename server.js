const UNKNOWN_ERROR = 1;
const knownErrors = [
	{ exitCode: UNKNOWN_ERROR, event: 'uncaughtException' },
	{ exitCode: UNKNOWN_ERROR, event: 'unhandledRejection' },
];

const log = msg => console.log(`pid: [${process.pid}] - ${msg}`);

knownErrors.forEach(({ exitCode, event }) => {
	process.on(event, (error) => {
		log(`Process exiting due to ${event} with error: ${error}`);
		if (exitCode === UNKNOWN_ERROR) {
			process.exit(exitCode);
		}

		process.exit(exitCode);
	})
})

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

