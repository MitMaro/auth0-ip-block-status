/* eslint-disable no-console */
'use strict';

const serverSetup = require('./server');
const getConfig = require('./config');

const SIGINT_ERROR = 120;
let sigint = false;

const httpServer = serverSetup(getConfig());

async function shutdown() {
	// catch second ctrl+c and force exit
	if (sigint) {
		process.exit(SIGINT_ERROR); // eslint-disable-line no-process-exit
	}
	sigint = true;

	console.log();
	console.log(`Gracefully shutting down process with PID ${process.pid}, this may take a few seconds`);
	console.log('Use ctrl-c again to force');
	console.log();
	try {
		await httpServer.end();
	}
	catch (error) {
		console.error(error);
	}
}

async function start() {
	try {
		try {
			await httpServer.setup();
			await httpServer.start();
		}
		catch (startError) {
			console.error(startError);
			await httpServer.end();
			return;
		}
	}
	catch (shutdownError) {
		console.error(shutdownError);
		return;
	}

	process.on('SIGINT', () => {
		console.log();
		console.log('SIGINT received, starting shutdown');
		shutdown();
	});

	process.on('SIGTERM', () => {
		console.log();
		console.log('SIGTERM received, starting shutdown');
		shutdown();
	});
}

start();
