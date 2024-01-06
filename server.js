const log = msg => `pid: [${process.pid}] - ${msg}`;

const connectToDB = async () => {
	const random = Math.random();
	if (random > 0.5) {
		return Promise.reject("Could not connect to DB");
	}
	log('DB connect with success');	
}

setInterval(() => connectToDB(), 200);

