/* eslint-disable no-console */
'use strict';

const http = require('http');
const stoppable = require('stoppable');
const checkIpAddressBlockedConstructor = require('./check-address-blocked');

const checkIpAddressBlocked = checkIpAddressBlockedConstructor();

function httpResponseHandler(req, res) {
	if (req.method !== 'GET') {
		res.statusCode = 405;
		res.end();
		return;
	}

	const ipAddress = req.url.substr(1);

	res.setHeader('Content-Type', 'application/json');
	let result;
	let statusCode;
	try {
		result = checkIpAddressBlocked(ipAddress);
		statusCode = 200;
	}
	catch (err) {
		result = {error: err.message};
		statusCode = err.type === 'InvalidAddress' ? 400 : 500;
	}
	res.statusCode = statusCode;
	res.write(JSON.stringify(result));
	res.end();
}

module.exports = (config) => {
	let server;
	return {
		async setup() {
			server = stoppable(http.createServer(httpResponseHandler));
		},
		async start() {
			if (server === undefined) {
				throw new Error('Attempted to call `start` before `setup` was called.');
			}
			return new Promise((resolve, reject) => {
				// eslint-disable-next-line promise/prefer-await-to-callbacks
				server.listen(config.server.port, (err) => {
					if (err) {
						return reject(err);
					}
					console.log(`Server listening on port ${server.address().port}`);
					return resolve();
				});
			});
		},
		async end() {
			if (server === undefined) {
				throw new Error('Attempted to call `start` before `setup` was called.');
			}
			return new Promise((resolve) => {
				if (server === undefined) {
					return resolve();
				}
				server.stop(() => resolve());
				return undefined;
			});
		},
	};
};
